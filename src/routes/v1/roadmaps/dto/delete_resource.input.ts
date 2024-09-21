import { Static, Type } from "@sinclair/typebox";

export const DeleteResourceInputSchema = Type.Object({
  id: Type.String(),
});

export type DeleteResourceInput = Static<typeof DeleteResourceInputSchema>;
