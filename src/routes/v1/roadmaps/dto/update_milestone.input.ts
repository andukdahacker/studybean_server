import { Static, Type } from "@sinclair/typebox";

export const UpdateMilestoneInputSchema = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
});

export type UpdateMilestoneInput = Static<typeof UpdateMilestoneInputSchema>;
