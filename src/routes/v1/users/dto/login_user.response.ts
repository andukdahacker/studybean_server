import { Static, Type } from "@sinclair/typebox";
import { UserSchema } from "./user.schema";
import { BaseResponseSchema } from "../../../../types/base_response";

export const LoginUserResponseSchema = BaseResponseSchema(
  Type.Object({
    token: Type.String(),
    user: UserSchema,
  })
);

export type LoginUserResponse = Static<typeof LoginUserResponseSchema>;
