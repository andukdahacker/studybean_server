import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionResourceSchema } from "./action_resource.schema";

export const CreateResourceResponseSchema =
  BaseResponseSchema(ActionResourceSchema);

export type CreateResourceResponse = Static<
  typeof CreateResourceResponseSchema
>;
