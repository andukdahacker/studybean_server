import { Static, Type } from "@sinclair/typebox";
import { Nullable } from "../../../../types/nullable";

export const ActionResourceSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Nullable(Type.String()),
  url: Type.String(),
  actionId: Type.String(),
});

export type ActionResource = Static<typeof ActionResourceSchema>;
