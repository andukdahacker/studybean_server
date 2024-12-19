import { Static, Type } from "@sinclair/typebox";
import { ResourceTypeSchema } from "./action_resource.schema";

export const CreateResourceInputSchema = Type.Object({
  title: Type.String(),
  url: Type.String(),
  actionId: Type.String(),
  description: Type.Optional(Type.String()),
  resourceType: ResourceTypeSchema,
});

export type CreateResourceInput = Static<typeof CreateResourceInputSchema>;
