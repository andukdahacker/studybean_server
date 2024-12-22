import { Static, Type } from "@sinclair/typebox";

export const GetResourceInputSchema = Type.Object({
  id: Type.String(),
});

export type GetResourceInput = Static<typeof GetResourceInputSchema>;
