import { Static, Type } from "@sinclair/typebox";

export const LoginUserInputSchema = Type.Object({
  idToken: Type.String(),
});

export type LoginUserInput = Static<typeof LoginUserInputSchema>;
