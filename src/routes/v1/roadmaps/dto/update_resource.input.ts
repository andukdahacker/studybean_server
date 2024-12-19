import { Static, Type } from "@sinclair/typebox";

export const UpdateResourceInputSchema = Type.Object({
  id: Type.String(),
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
});

export type UpdateResourceInput = Static<typeof UpdateResourceInputSchema>;
