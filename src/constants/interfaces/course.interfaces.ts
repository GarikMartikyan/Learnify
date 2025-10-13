export interface ICourse {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  startDate: string;
  language: string;
  price: number;
  createdAt: string;
  image?: string;
}

export interface IChapter {
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
  price: number;
  category: string;
  image?: string;
  chapters?: IChapter[];
  exams?: IExam[];
}
