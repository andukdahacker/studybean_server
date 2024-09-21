import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { MilestoneSchema } from "./milestone.schema";

export const UpdateMilestoneResponseSchema =
  BaseResponseSchema(MilestoneSchema);

export type UpdateMilestoneResponse = Static<
  typeof UpdateMilestoneResponseSchema
>;
