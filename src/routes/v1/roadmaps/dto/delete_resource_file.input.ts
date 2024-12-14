import { Static, Type } from "@sinclair/typebox";

export const DeleteResourceFileInputSchema = Type.Object({
  resourceId: Type.String(),
});

export type DeleteResourceFileInput = Static<
  typeof DeleteResourceFileInputSchema
>;
