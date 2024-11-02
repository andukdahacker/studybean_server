import { TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

export const NullableAndOptional = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null(), Type.Optional(schema)]);
