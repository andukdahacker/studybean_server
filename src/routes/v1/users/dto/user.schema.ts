import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String(),
  credits: Type.Number(),
  paidCredits: Type.Number(),
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
});

export type User = Static<typeof UserSchema>;
