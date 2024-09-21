import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";
import { ActionResourceSchema } from "./action_resource.schema";
import { DurationUnitSchema } from "./duration_unit.enum";

export const ActionSchema = Type.Object({
  id: Type.String(),
  milestoneId: Type.String(),
  name: Type.String(),
  description: Nullable(Type.String()),
  isCompleted: Type.Boolean(),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
  resource: Nullable(Type.Array(ActionResourceSchema)),
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
  deadline: Nullable(Type.Any()),
});

export type Action = Static<typeof ActionSchema>;
