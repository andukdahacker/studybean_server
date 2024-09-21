import { Static, Type } from "@sinclair/typebox";

export const GetManyRoadmapInputSchema = Type.Object({
  take: Type.Number(),
  cursor: Type.Optional(Type.String()),
});

export type GetManyRoadmapInput = Static<typeof GetManyRoadmapInputSchema>;
