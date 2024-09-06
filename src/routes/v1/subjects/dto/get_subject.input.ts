import { Static, Type } from "@sinclair/typebox";

export const GetSubjectInputSchema = Type.Object({
  id: Type.String(),
});

export type GetSubjectInput = Static<typeof GetSubjectInputSchema>;
