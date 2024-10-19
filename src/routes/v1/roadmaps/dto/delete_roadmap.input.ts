import { Static, Type } from "@sinclair/typebox";

export const DeleteRoadmapInputSchema = Type.Object({
  id: Type.String()
})

export type DeleteRoadmapInput = Static<typeof DeleteRoadmapInputSchema>;
