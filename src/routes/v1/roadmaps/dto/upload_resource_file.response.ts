import { Static } from "@sinclair/typebox";
import { BaseResponseSchema } from "../../../../types/base_response";
import { ActionResourceSchema } from "./action_resource.schema";

export const UploadResourceFileResponseSchema = BaseResponseSchema(ActionResourceSchema);

export type UploadResourceFileResponse = Static<typeof UploadResourceFileResponseSchema>;
