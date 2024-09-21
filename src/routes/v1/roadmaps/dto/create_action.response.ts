import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionSchema } from "./action.schema";

export const CreateActionResponseSchema = BaseResponseSchema(ActionSchema);

export type CreateActionResponse = Static<typeof CreateActionResponseSchema>;
