import { Static } from "@sinclair/typebox";
import { PaginatedBaseReponseSchema } from "../../../../types/base_response";
import { SubjectSchema } from "./subject.schema";

export const GetManySubjectResponseSchema =
  PaginatedBaseReponseSchema(SubjectSchema);

export type GetManySubjectResponse = Static<
  typeof GetManySubjectResponseSchema
>;
