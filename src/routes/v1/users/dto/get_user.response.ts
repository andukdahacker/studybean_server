import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { UserSchema } from "./user.schema";

export const GetUserResponseSchema = BaseResponseSchema(UserSchema);

export type GetUserResponse = Static<typeof GetUserResponseSchema>
