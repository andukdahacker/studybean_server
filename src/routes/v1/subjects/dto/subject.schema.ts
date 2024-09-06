import { Static, Type } from "@sinclair/typebox";

export const SubjectSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type Subject = Static<typeof SubjectSchema>;
