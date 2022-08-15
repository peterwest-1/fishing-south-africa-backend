import { FishCaught } from "../entity/FishCaught";
import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./FieldError";

@ObjectType()
export class FishCaughtResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => FishCaught, { nullable: true })
  fishCaught?: FishCaught;
}
