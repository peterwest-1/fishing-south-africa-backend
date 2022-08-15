import argon2 from "argon2";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { userSessionIDPrefix } from "../../constants";
import { User } from "../../entity/User";
import redis from "../../redis";
import { AuthenticationInput } from "../../shared/AuthenticationInput";
import { ACCOUNT_ERROR } from "../../shared/Errors/account";
import { EMAIL_ERROR } from "../../shared/Errors/email";
import { PASSWORD_ERROR } from "../../shared/Errors/password";
import { UserResponse } from "../../shared/UserResponse";
import { MyContext } from "../../types";

@Resolver()
export class LoginResolver {
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
}
