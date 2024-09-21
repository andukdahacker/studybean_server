import { Static, Type } from "@sinclair/typebox";

export const UpdateActionInputSchema = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  isCompleted: Type.Optional(Type.Boolean()),
});

export type UpdateActionInput = Static<typeof UpdateActionInputSchema>;
