import { Static, Type } from "@sinclair/typebox";
import { SubjectSchema } from "../../subjects/dto/subject.schema";
import { MilestoneSchema } from "./milestone.schema";
import { Nullable } from "../../../../types/nullable";
import { UserSchema } from "../../users/dto/user.schema";

export const RoadmapSchema = Type.Object({
  id: Type.String(),
  subject: Nullable(SubjectSchema),
  subjectId: Type.String(),
  userId: Nullable(Type.String()),
  user: Nullable(UserSchema),
  milestone: Nullable(Type.Array(MilestoneSchema)),
  goal: Type.String(),
  createdAt: Type.Any(),
  updatedAt: Type.Any(),
});

export type Roadmap = Static<typeof RoadmapSchema>;
