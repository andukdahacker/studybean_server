import { DurationUnit } from "@prisma/client";
import { Type } from "@sinclair/typebox";

export const DurationUnitSchema = Type.Union([
  Type.Literal(DurationUnit.DAY),
  Type.Literal(DurationUnit.WEEK),
  Type.Literal(DurationUnit.MONTH),
  Type.Literal(DurationUnit.YEAR),
]);
