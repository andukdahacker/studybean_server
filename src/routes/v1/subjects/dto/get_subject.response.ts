import { Static, Type } from "@sinclair/typebox";
import { SubjectSchema } from "./subject.schema";
import { BaseResponseSchema } from "../../../../types/base_response";

export const GetSubjectResponseSchema = BaseResponseSchema(
  Type.Object({
    subject: SubjectSchema,
  })
);

export type GetSubjectResponse = Static<typeof GetSubjectResponseSchema>;
