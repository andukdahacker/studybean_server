import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionSchema } from "./action.schema";

export const UpdateActionResponseSchema = BaseResponseSchema(ActionSchema);

export type UpdateActionResponse = Static<typeof UpdateActionResponseSchema>;
