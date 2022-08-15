import { Ctx, Query } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types";

export class MeResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }
}
