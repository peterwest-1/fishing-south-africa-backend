import { SignedURLResponse } from "../../shared/SignedURLResponse";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppDataSource } from "../../data-source";
import { FishCaught } from "../../entity/FishCaught";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { FishCaughtInput } from "../../shared/FishCaughtInput";
import { FishCaughtResponse } from "../../shared/FishCaughtResponse";
import { MyContext } from "../../types";
import { generateGCSSignedURL } from "../../utilities/generateGCSSignedURL";

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

  @Mutation(() => SignedURLResponse)
  @UseMiddleware(isAuthenticated)
  async fishImageUploadURL(@Arg("fishCaughtId") fishCaughtId: string) {
    const url = await generateGCSSignedURL("fishes", fishCaughtId);

    return {
      signedURL: url,
    };
  }

  @Mutation(() => FishCaughtResponse)
  @UseMiddleware(isAuthenticated)
  async createFishCaught(
    @Arg("input", () => FishCaughtInput) input: FishCaughtInput,
    @Ctx() { req }: MyContext
  ): Promise<FishCaughtResponse> {
    const fishCaught = FishCaught.create({
      ...input,
      userId: req.session.userId,
    });

    if (!fishCaught) {
      return { errors: [{ field: "thing", message: "could not create fish" }] };
    }

    await fishCaught.save();
    return { fishCaught };
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
