import { Static, Type } from "@sinclair/typebox";

export const CreateResourceInputSchema = Type.Object({
  title: Type.String(),
  url: Type.String(),
  actionId: Type.String(),
  description: Type.Optional(Type.String()),
});

export type CreateResourceInput = Static<typeof CreateResourceInputSchema>;
