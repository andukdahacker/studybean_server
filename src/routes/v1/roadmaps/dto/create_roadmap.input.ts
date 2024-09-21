import { Static, Type } from "@sinclair/typebox";
import { DurationUnitSchema } from "./duration_unit.enum";

export const CreateRoadmapInputSchema = Type.Object({
  subjectName: Type.String(),
  goal: Type.String(),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
});

export type CreateRoadmapInput = Static<typeof CreateRoadmapInputSchema>;
