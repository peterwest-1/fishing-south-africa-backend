import { COOKIE_NAME } from "../../constants";
import { MyContext } from "../../types";
import { removeUserSessions } from "../../utilities/removeUserSessions";
import { Resolver, Mutation, Ctx } from "type-graphql";

@Resolver()
export class LogoutResolver {
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
