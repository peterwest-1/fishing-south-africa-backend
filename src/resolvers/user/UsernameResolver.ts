import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { MyContext } from "../../types";

@Resolver()
export class UsernameResolver {
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
}
