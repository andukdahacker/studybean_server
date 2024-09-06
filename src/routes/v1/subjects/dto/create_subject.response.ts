import { Static, Type } from "@sinclair/typebox";
import { SubjectSchema } from "./subject.schema";
import { BaseResponseSchema } from "../../../../types/base_response";

export const CreateSubjectResponseSchema = BaseResponseSchema(
  Type.Object({ subject: SubjectSchema })
);

export type CreateSubjectResponse = Static<typeof CreateSubjectResponseSchema>;
