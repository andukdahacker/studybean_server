import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { MilestoneSchema } from "./milestone.schema";

export const AddMilestoneResponseSchema = BaseResponseSchema(MilestoneSchema);

export type AddMilestoneResponse = Static<typeof AddMilestoneResponseSchema>;
