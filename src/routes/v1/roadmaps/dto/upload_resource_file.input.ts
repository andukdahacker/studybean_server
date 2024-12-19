import { Static, Type } from "@sinclair/typebox";
import { ResourceTypeSchema } from "./action_resource.schema";

export const UploadResourceFileInputSchema = Type.Object({
  file: Type.Any(),
  fileName: Type.String(),
  title: Type.String(),
  description: Type.String(),
  actionId: Type.String(),
  resourceType: ResourceTypeSchema,
});

export type UploadResourceFileInput = Static<
  typeof UploadResourceFileInputSchema
>;
