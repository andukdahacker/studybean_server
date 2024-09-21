import { TSchema, Type, Static } from "@sinclair/typebox";
import { Nullable } from "./nullable";

const BaseResponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    data: schema,
    message: Type.String(),
  });

const NoDataResponseSchema = Type.Object({
  message: Type.String(),
});

type NoDataResponse = Static<typeof NoDataResponseSchema>;

const BaseReponseErrorSchema = Type.Object({
  error: Type.String(),
  message: Type.String(),
});

const PageInfoSchema = Type.Object({
  hasNextPage: Type.Boolean(),
  cursor: Nullable(Type.String()),
});

const PaginatedBaseReponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    data: Type.Optional(
      Type.Object({
        nodes: Type.Array(schema),
        pageInfo: PageInfoSchema,
      })
    ),
    message: Type.String(),
  });

export {
  NoDataResponseSchema,
  NoDataResponse,
  BaseResponseSchema,
  BaseReponseErrorSchema,
  PaginatedBaseReponseSchema,
};
