import { Static, Type } from "@sinclair/typebox";

export const DeleteMilestoneInputSchema = Type.Object({
  id: Type.String(),
});

export type DeleteMilestoneInput = Static<typeof DeleteMilestoneInputSchema>;
