import { Static, Type } from "@sinclair/typebox";

export const ActionResourceSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  url: Type.String(),
  actionId: Type.String(),
});

export type ActionResource = Static<typeof ActionResourceSchema>;
