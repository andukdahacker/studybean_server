import { Static, Type } from "@sinclair/typebox";

export const DeleteActionInputSchema = Type.Object({
  id: Type.String(),
});

export type DeleteActionInput = Static<typeof DeleteActionInputSchema>;
