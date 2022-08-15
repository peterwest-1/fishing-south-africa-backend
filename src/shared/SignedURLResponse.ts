import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SignedURLResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  signedURL?: string;
}
