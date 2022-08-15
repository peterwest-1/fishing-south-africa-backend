import { buildSchema } from "type-graphql";
import { FishCaughtResolver } from "../resolvers/fishCaught/FishCaughtResolver";
import { ChangePasswordResolver } from "../resolvers/user/ChangePasswordResolver";
import { ForgotPasswordResolver } from "../resolvers/user/ForgotPasswordResolver";
import { LoginResolver } from "../resolvers/user/LoginResolver";
import { LogoutResolver } from "../resolvers/user/LogoutResolver";
import { MeResolver } from "../resolvers/user/MeResolver";
import { RegisterResolver } from "../resolvers/user/RegisterResolver";
import { UsernameResolver } from "../resolvers/user/UsernameResolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      RegisterResolver,
      MeResolver,
      UsernameResolver,
      FishCaughtResolver,
    ],
    validate: false,
  });
