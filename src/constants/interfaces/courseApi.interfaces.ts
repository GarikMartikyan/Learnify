/** Types of the Course & Assessment service API (port 8082). */

export type CourseStatus = "draft" | "published" | "archived";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseLanguage = "en" | "am" | "ru";
export type CourseItemType = "chapter" | "exam";
export type ContentBlockType =
  | "heading"
  | "text"
  | "image"
  | "file"
  | "youtube"
  | "external_link";
export type QuestionType =
  | "true_false"
  | "single_choice"
  | "multiple_choice"
  | "short_answer";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface ICategory {
  id: string;
  name: string;
  /** False for custom categories that still wait for admin approval. */
  approved: boolean;
}

export interface ITeacherSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

/** A course as shown on cards and in tables. */
export interface ICourseSummary {
  id: string;
  name: string;
  description: string | null;
  category: ICategory | null;
  language: CourseLanguage;
  level: CourseLevel;
  status: CourseStatus;
  disabled: boolean;
  /** Temporary (1h) link, or null. */
  coverImageUrl: string | null;
  teacher: ITeacherSummary;
  chapterCount: number;
  examCount: number;
  createdAt: string;
  updatedAt: string;
}

/** One step of a course's structure. Exactly one of chapterId / examId is set. */
export interface ICourseItem {
  id: string;
  itemType: CourseItemType;
  chapterId: string | null;
  examId: string | null;
  title: string;
  disabled: boolean;
}

export interface ICourseDetail {
  course: ICourseSummary;
  items: ICourseItem[];
}

export interface ICreateCourseRequest {
  name: string;
  description?: string;
  categoryId?: string;
  /** "Other": proposes a custom category. */
  newCategoryName?: string;
  language: CourseLanguage;
  level: CourseLevel;
}

export type IUpdateCourseRequest = Partial<ICreateCourseRequest>;

export interface IExamSettings {
  title: string;
  durationMinutes: number;
  passingPercentage: number;
}

export interface IContentBlock {
  id: string;
  blockType: ContentBlockType;
  position: number;
  textContent: string | null;
  /** Temporary (1h) link for image / file blocks. */
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  externalUrl: string | null;
  disabled: boolean;
}

export interface IChapter {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  disabled: boolean;
  /** True for the course's own teacher. */
  canEdit: boolean;
  blocks: IContentBlock[];
}

export interface IQuestionOption {
  /** Missing for options that are not saved yet. */
  id?: string;
  optionText: string;
  correct: boolean;
}

export interface IQuestion {
  id: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  questionText: string;
  marks: number;
  correctAnswer: string | null;
  options: IQuestionOption[];
}

export interface IQuestionRequest {
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  questionText: string;
  marks: number;
  correctAnswer?: string;
  options: IQuestionOption[];
}

export type IDifficultyCounts = Record<QuestionDifficulty, number>;

/** Everything the exam editor needs. */
export interface IExamEditor {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  durationMinutes: number;
  passingPercentage: number;
  /** Questions per attempt by difficulty. */
  configuration: IDifficultyCounts;
  /** Questions in the pool by difficulty. */
  availableQuestions: IDifficultyCounts;
  questions: IQuestion[];
}

export interface ICatalogQuery {
  search?: string;
  categoryId?: string;
  level?: CourseLevel;
  language?: CourseLanguage;
  page: number;
  size: number;
}

export interface IAdminCoursesQuery {
  search?: string;
  status?: CourseStatus;
  disabled?: boolean;
  page: number;
  size: number;
}
