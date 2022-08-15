import { User } from "../../entity/User";
import { MyContext } from "../../types";
import { Query, Ctx } from "type-graphql";

export class MeResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }
}
