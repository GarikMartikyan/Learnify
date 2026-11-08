import type {
  CourseItemType,
  IContentBlock,
  QuestionType,
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
  /** The student has already marked this chapter as finished. */
  done: boolean;
  enrollment: IEnrollment;
}

/** One attempt in an exam's history. Result fields are null while the attempt is open. */
export interface IAttemptSummary {
  id: string;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
  totalMarks: number | null;
  /** Rounded down. */
  percent: number | null;
  passed: boolean | null;
}

/** The exam page before starting. */
export interface IExamOverview {
  examId: string;
  enrollmentId: string;
  courseId: string;
  courseName: string | null;
  title: string;
  durationMinutes: number;
  passingPercentage: number;
  /** How many questions an attempt draws. */
  questionCount: number;
  state: ItemState;
  /** At least one attempt passed: no retake. */
  passed: boolean;
  /** The attempt to resume, if any. */
  openAttempt: IAttemptSummary | null;
  /** Graded attempts, newest first. */
  attempts: IAttemptSummary[];
}

/** A question of an attempt with the student's answer. Never contains the correct answer. */
export interface IAttemptQuestion {
  questionId: string;
  position: number;
  questionType: QuestionType;
  questionText: string;
  marks: number;
  options: { id: string; optionText: string }[];
  selectedOptionIds: string[];
  answerText: string | null;
  /** null until graded. */
  marksAwarded: number | null;
  correct: boolean | null;
}

/** An attempt: questions and answers while open (submittedAt null), plus the result once graded. */
export interface IAttempt {
  id: string;
  enrollmentId: string;
  courseId: string;
  examId: string;
  examTitle: string | null;
  passingPercentage: number;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  secondsLeft: number;
  score: number | null;
  totalMarks: number | null;
  percent: number | null;
  passed: boolean | null;
  questions: IAttemptQuestion[];
}

export interface ISaveAnswerRequest {
  attemptId: string;
  questionId: string;
  optionIds?: string[];
  text?: string;
}
