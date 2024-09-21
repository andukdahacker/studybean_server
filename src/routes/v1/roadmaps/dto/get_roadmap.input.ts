import { Static, Type } from "@sinclair/typebox";

export const GetRoadmapInputSchema = Type.Object({
  id: Type.String(),
});

export type GetRoadmapInput = Static<typeof GetRoadmapInputSchema>;
