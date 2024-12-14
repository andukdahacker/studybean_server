import { Static, Type } from "@sinclair/typebox";

export const CreateRoadmapInputSchema = Type.Object({
  subjectName: Type.String(),
  goal: Type.String(),
});

export type CreateRoadmapInput = Static<typeof CreateRoadmapInputSchema>;
