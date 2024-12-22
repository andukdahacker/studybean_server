import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionResourceSchema } from "./action_resource.schema";

export const UpdateResourceNotesResponseSchema =
  BaseResponseSchema(ActionResourceSchema);

export type UpdateResourceNotesResponse = Static<
  typeof UpdateResourceNotesResponseSchema
>;
