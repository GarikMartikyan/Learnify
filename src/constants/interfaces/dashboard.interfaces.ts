export interface IUpcomingExam {
  id: number;
  courseTitle: string;
  examTitle: string;
  date: string; // ISO string
}

export interface IUpcomingChapter {
  id: number;
  courseTitle: string;
  chapterTitle: string;
  releaseDate: string;
}

export interface IRecentCourse {
  id: number;
  title: string;
  progress: number; // 0-100
}
