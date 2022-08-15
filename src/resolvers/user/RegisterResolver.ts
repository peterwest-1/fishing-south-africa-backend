import { User } from "../../entity/User";
import redis from "../../redis";
import { AuthenticationInput } from "../../shared/AuthenticationInput";
import { EMAIL_ERROR } from "../../shared/Errors/email";
import { UserResponse } from "../../shared/UserResponse";
import { MyContext } from "../../types";
import { createConfirmationLink } from "../../utilities/createConfirmationLink";
import { generateVerifyMailOptions } from "../../utilities/generateMailOptions";
import { sendEmail } from "../../utilities/sendMail";
import { validateRegister } from "../../validators/register";
import { Mutation, Arg, Ctx, Resolver } from "type-graphql";
import argon2 from "argon2";

@Resolver()
export class RegisterResolver {
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
}
