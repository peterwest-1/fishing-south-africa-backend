import argon2 from "argon2";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { COOKIE_NAME, userSessionIDPrefix } from "../../constants";
import { User } from "../../entity/User";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import redis from "../../redis";
import { AuthenticationInput } from "../../shared/AuthenticationInput";
import { ACCOUNT_ERROR } from "../../shared/Errors/account";
import { EMAIL_ERROR } from "../../shared/Errors/email";
import { PASSWORD_ERROR } from "../../shared/Errors/password";
import { UserResponse } from "../../shared/UserResponse";
import { MyContext } from "../../types";
import { createConfirmationLink } from "../../utilities/createConfirmationLink";
import { generateGCSSignedURL } from "../../utilities/generateGCSSignedURL";
import { generateVerifyMailOptions } from "../../utilities/generateMailOptions";
import { removeUserSessions } from "../../utilities/removeUserSessions";
import { sendEmail } from "../../utilities/sendMail";
import { validateRegister } from "../../validators/register";
import { v4 } from "uuid";

@ObjectType()
export class ProfileInformationResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  signedURL?: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async isUsernameAvailable(@Arg("username") username: string): Promise<boolean> {
    const user = await User.findOneBy({ username });
    if (user) {
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async setUsername(@Arg("username") username: string, @Ctx() { req }: MyContext) {
    await User.update({ id: req.session.userId }, { username });
    return true;
  }

  @Mutation(() => ProfileInformationResponse)
  @UseMiddleware(isAuthenticated)
  async addProfileInformation(
    @Arg("username") username: string,
    @Arg("filename") filename: string,
    @Ctx() { req }: MyContext
  ) {
    await User.update({ id: req.session.userId }, { username });

    const url = await generateGCSSignedURL("profiles", req.session.userId as string);

    return {
      signedURL: url,
    };
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req, url }: MyContext
  ): Promise<UserResponse> {
    const errors = await validateRegister({ email, password });
    if (errors) return { errors };

    const hash = await argon2.hash(password);
    let user;
    try {
      user = await User.create({
        email: email,
        password: hash,
      }).save();

      const confirmUserLink = await createConfirmationLink(url, user.id);

      const mailOptions = generateVerifyMailOptions(email, confirmUserLink);
      await sendEmail(mailOptions);
    } catch (error) {
      if (error.code == "23505" || error.detail.includes("already exists")) return { errors: [EMAIL_ERROR.DUPLICATE] };
    }

    req.session.userId = user?.id;
    if (user) {
      redis.lpush(user.id, req.sessionID);
    }

    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("input") { email, password }: AuthenticationInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) return { errors: [EMAIL_ERROR.DOESNT_EXIST] };

    if (user.forgotPasswordLocked) {
      return { errors: [ACCOUNT_ERROR.FORGOT_PASSWORD_LOCKED] };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) return { errors: [PASSWORD_ERROR.DOESNT_MATCH] };
    // if (!user.confirmed) return { errors: [ACCOUNT_NOT_VERIFIED] };

    req.session.userId = user.id;
    await redis.lpush(`${userSessionIDPrefix}${user.id}`, req.sessionID);

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) =>
      req.session.destroy((err: Error) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          reject(false);
          return;
        }
        resolve(true);
      })
    );
  }

  //Needs to be tested
  @Mutation(() => Boolean)
  async logoutAll(@Ctx() { req }: MyContext) {
    const { userId } = req.session;
    if (userId) {
      await removeUserSessions(userId);
      return true;
    }

    return false;
  }
}
