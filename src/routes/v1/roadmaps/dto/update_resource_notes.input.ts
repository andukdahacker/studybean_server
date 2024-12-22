import { Static, Type } from "@sinclair/typebox";

export const UpdateResourceNotesInputSchema = Type.Object({
  resourceId: Type.String(),
  notes: Type.String(),
});

export type UpdateResourceNotesInput = Static<
  typeof UpdateResourceNotesInputSchema
>;
