import { Static, Type } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { UserSchema } from "./user.schema";

export const CreateUserResponseSchema = BaseResponseSchema(
  Type.Object({ user: UserSchema })
);

export type CreateUserResponse = Static<typeof CreateUserResponseSchema>;
