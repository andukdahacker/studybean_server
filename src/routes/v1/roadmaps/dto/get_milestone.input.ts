import { Static, Type } from "@sinclair/typebox";

export const GetMilestoneInputSchema = Type.Object({
  id: Type.String(),
});

export type GetMilestoneInput = Static<typeof GetMilestoneInputSchema>;
