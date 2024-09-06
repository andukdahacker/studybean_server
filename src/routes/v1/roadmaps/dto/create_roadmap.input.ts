import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";
import { DurationUnitSchema } from "./duration_unit.enum";

export const CreateRoadmapInputSchema = Type.Object({
  subjectId: Type.String(),
  userId: Nullable(Type.String()),
  goal: Type.String(),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
});

export type CreateRoadmapInput = Static<typeof CreateRoadmapInputSchema>;
