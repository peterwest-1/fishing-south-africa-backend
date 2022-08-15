import { FishCaught } from "../../entity/FishCaught";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { FishCaughtInput } from "../../shared/FishCaughtInput";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { MyContext } from "../../types";
import { AppDataSource } from "../../data-source";

@Resolver()
export class FishCaughtResolver {
  @Query(() => FishCaught, { nullable: true })
  async fish(@Arg("id", () => String) id: string): Promise<FishCaught | null> {
    return FishCaught.findOneBy({ id });
  }

  @Query(() => [FishCaught], { nullable: true })
  async fishCaughtForOwner(@Arg("userId", () => String) userId: string): Promise<FishCaught[] | null> {
    return FishCaught.findBy({
      userId,
    });
  }

  @Query(() => [FishCaught])
  async fishes() {
    return await FishCaught.find({});
  }

  @Mutation(() => FishCaught)
  @UseMiddleware(isAuthenticated)
  async createFishCaught(@Arg("input", () => FishCaughtInput) input: FishCaughtInput, @Ctx() { req }: MyContext) {
    const fishCaught = FishCaught.create({
      ...input,
      userId: req.session.userId,
    });

    return await fishCaught.save();
  }

  @Mutation(() => FishCaught, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async updateFishCaught(
    @Arg("id", () => String) id: string,
    @Arg("input", () => FishCaughtInput)
    { species, length, location, notes, weight }: FishCaughtInput,
    @Ctx() { req }: MyContext
  ): Promise<FishCaught | null> {
    const result = await AppDataSource.createQueryBuilder()
      .update(FishCaught)
      .set({ species, length, location, notes, weight })
      .where('id = :id and "ownerId" = :ownerId', {
        id,
        ownerId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteFishCaught(@Arg("id", () => String) id: string): Promise<boolean> {
    await FishCaught.delete({ id });
    return true;
  }
}
