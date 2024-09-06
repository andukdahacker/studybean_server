import { Static, Type } from "@sinclair/typebox";
import { ActionSchema } from "./action.schema";
import { Nullable } from "../../../../types/nullable";

export const MilestoneSchema = Type.Object({
  id: Type.String(),
  index: Type.Number(),
  name: Type.String(),
  roadmapId: Type.String(),
  action: Nullable(Type.Array(ActionSchema)),
});

export type Milestone = Static<typeof MilestoneSchema>;
