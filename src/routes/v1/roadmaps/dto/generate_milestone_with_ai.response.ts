import { BaseResponseSchema } from "../../../../types/base_response";
import { GenerateMilestonesResponseSchema } from "../../../../services/google_gemini.service";
import { Static, Type } from "@sinclair/typebox";

export const GenerateMilestonesWithAIResponseSchema = BaseResponseSchema(
  GenerateMilestonesResponseSchema
);

export type GenerateMilestonesWithAIResponse = Static<
  typeof GenerateMilestonesWithAIResponseSchema
>;
