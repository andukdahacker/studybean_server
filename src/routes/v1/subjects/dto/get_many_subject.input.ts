import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";

export const GetManySubjectInputSchema = Type.Object({
  name: Type.String(),
  take: Type.Number(),
  cursor: Nullable(Type.String()),
});

export type GetManySubjectInput = Static<typeof GetManySubjectInputSchema>;
