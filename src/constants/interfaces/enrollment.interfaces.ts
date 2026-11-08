import type {
  CourseItemType,
  IContentBlock,
} from "./courseApi.interfaces.ts";

export type EnrollmentStatus = "active" | "abandoned" | "completed";

/** done: chapter viewed / exam passed; available: the next item to do; locked: an earlier item is not done yet. */
export type ItemState = "done" | "available" | "locked";

/** One course item with the student's state on it. Exactly one of chapterId / examId is set. */
export interface IItemProgress {
  itemId: string;
  itemType: CourseItemType;
  chapterId: string | null;
  examId: string | null;
  title: string;
  state: ItemState;
  /** The teacher removed it after the student had done it: still readable, no longer counted. */
  removed: boolean;
}

/** An enrollment with its progress. */
export interface IEnrollment {
  id: string;
  courseId: string;
  /** null if the course no longer exists. */
  courseName: string | null;
  /** An admin has hidden the course. */
  courseDisabled: boolean;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  abandonedAt: string | null;
  restoredAt: string | null;
  doneCount: number;
  totalCount: number;
  progressPercent: number;
  /** The item to continue with; null when everything is done. */
  nextItem: IItemProgress | null;
}

/** The learning view: the enrollment plus every visible item in order. */
export interface IEnrollmentDetail {
  enrollment: IEnrollment;
  items: IItemProgress[];
}

/** A chapter opened by an enrolled student (disabled blocks are already left out). */
export interface IStudentChapter {
  chapter: {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    blocks: Omit<IContentBlock, "disabled">[];
  };
  /** Progress after this chapter was marked as viewed. */
  enrollment: IEnrollment;
}
