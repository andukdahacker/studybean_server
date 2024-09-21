import { Static, Type } from "@sinclair/typebox";

export const UpdateResourceInputSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  url: Type.String(),
  description: Type.Optional(Type.String()),
});

export type UpdateResourceInput = Static<typeof UpdateResourceInputSchema>;
