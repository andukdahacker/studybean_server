import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { MilestoneSchema } from "./milestone.schema";

export const GetMilestoneResponseSchema = BaseResponseSchema(MilestoneSchema);

export type GetMilestoneResponse = Static<typeof GetMilestoneResponseSchema>;
