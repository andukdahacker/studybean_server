import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";

export const CreateSubjectInputSchema = Type.Object({
  name: Type.String(),
});

export type CreateSubjectInput = Static<typeof CreateSubjectInputSchema>;
