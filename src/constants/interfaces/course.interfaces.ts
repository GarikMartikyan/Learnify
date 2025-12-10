export interface ICourse {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  startDate: string;
  language: string;
  createdAt: string;
  image?: string;
}

export interface IChapterInfo {
  id: number;
  title: string;
  description?: string;
  order?: number;
}

export interface IExam {
  id: number;
  title: string;
  description?: string;
  totalQuestions?: number;
  durationMinutes?: number;
}

export interface ICourseDetails {
  id: number;
  title: string;
  description: string;
  teacher: string;
  language: string;
  startingDate: string; // ISO string or 'YYYY-MM-DD'
  category: string;
  image?: string;
  chapters?: IChapterInfo[];
  exams?: IExam[];
}
