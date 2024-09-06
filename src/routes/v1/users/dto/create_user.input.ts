import { Static, Type } from "@sinclair/typebox";

export const CreateUserInputSchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 30 }),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 20 }),
});

export type CreateUserInput = Static<typeof CreateUserInputSchema>;
