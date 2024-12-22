import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionResourceSchema } from "./action_resource.schema";

export const GetResourceResponseSchema =
  BaseResponseSchema(ActionResourceSchema);

export type GetResourceResponse = Static<typeof GetResourceResponseSchema>;
