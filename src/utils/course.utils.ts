import type {
  CourseLevel,
  CourseStatus,
} from "../constants/interfaces/courseApi.interfaces.ts";

/** Natural order of levels, for sorting (not alphabetical). */
export const LEVEL_ORDER: Record<CourseLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const STATUS_ORDER: Record<CourseStatus, number> = {
  draft: 0,
  published: 1,
  archived: 2,
};

/** Table sorter for course status: draft → published → archived, disabled courses after enabled ones. */
export function compareCourseStatus(
  a: { status: CourseStatus; disabled: boolean },
  b: { status: CourseStatus; disabled: boolean },
) {
  return (
    STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
    Number(a.disabled) - Number(b.disabled)
  );
}
