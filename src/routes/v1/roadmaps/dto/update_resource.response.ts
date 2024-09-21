import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionResourceSchema } from "./action_resource.schema";

export const UpdateResourceResponseSchema =
  BaseResponseSchema(ActionResourceSchema);

export type UpdateResourceResponse = Static<
  typeof UpdateResourceResponseSchema
>;
