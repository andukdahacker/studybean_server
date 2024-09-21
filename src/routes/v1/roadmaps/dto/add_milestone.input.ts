import { Static, Type } from "@sinclair/typebox";

export const AddMilestoneInputSchema = Type.Object({
  roadmapId: Type.String(),
  name: Type.String(),
  index: Type.Number(),
});

export type AddMilestoneInput = Static<typeof AddMilestoneInputSchema>;
