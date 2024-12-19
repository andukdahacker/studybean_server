import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";

export const ResourceTypeSchema = Type.Union([
  Type.Literal("PDF"),
  Type.Literal("YOUTUBE"),
  Type.Literal("WEBSITE"),
  Type.Literal("IMAGE"),
]);

export type ResourceType = Static<typeof ResourceTypeSchema>;

export const ActionResourceSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Nullable(Type.String()),
  url: Type.String(),
  actionId: Type.String(),
  resourceType: ResourceTypeSchema,
});

export type ActionResource = Static<typeof ActionResourceSchema>;
