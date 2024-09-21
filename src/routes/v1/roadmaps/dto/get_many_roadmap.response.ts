import { Static } from "@sinclair/typebox";
import { PaginatedBaseReponseSchema } from "../../../../types/base_response";
import { RoadmapSchema } from "./roadmap.schema";

export const GetManyRoadmapResponseSchema =
  PaginatedBaseReponseSchema(RoadmapSchema);

export type GetManyRoadmapResponse = Static<
  typeof GetManyRoadmapResponseSchema
>;
