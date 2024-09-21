import { Static, Type } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionSchema } from "./action.schema";

export const GetActionResponseSchema = BaseResponseSchema(ActionSchema);

export type GetActionResponse = Static<typeof GetActionResponseSchema>;
