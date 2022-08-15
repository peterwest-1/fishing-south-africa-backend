import { FishCaught } from "src/entity/FishCaught";
import { Field, Float, InputType } from "type-graphql";
import { Column } from "typeorm";

@InputType()
export class FishCaughtInput {
  @Field(() => String)
  species: string;

  @Field(() => Float, { nullable: true })
  weight?: number;

  @Field(() => Float, { nullable: true })
  length?: number;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}
