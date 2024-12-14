import { Static, Type } from "@sinclair/typebox";

export const UploadResourceFileInputSchema = Type.Object({
  file: Type.Any(),
  fileName: Type.String(),
  title: Type.String(),
  description: Type.String(),
  actionId: Type.String(),
});

export type UploadResourceFileInput = Static<
  typeof UploadResourceFileInputSchema
>;
