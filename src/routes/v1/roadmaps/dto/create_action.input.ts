import { Static, Type } from "@sinclair/typebox";
import { DurationUnitSchema } from "./duration_unit.enum";

export const CreateActionInputSchema = Type.Object({
  milestoneId: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
});

export type CreateActionInput = Static<typeof CreateActionInputSchema>;
