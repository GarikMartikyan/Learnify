import type {
  IRecentCourse,
  IUpcomingChapter,
  IUpcomingExam,
} from "../constants/interfaces/dashboard.interfaces.ts";

export const mockUpcomingExams: IUpcomingExam[] = [
  {
    id: 1,
    courseTitle: "JavaScript Basics",
    examTitle: "JS Fundamentals Quiz",
    date: "2025-10-20T10:00:00Z",
  },
  {
    id: 2,
    courseTitle: "Advanced React",
    examTitle: "React Hooks Exam",
    date: "2025-10-22T14:00:00Z",
  },
];

export const mockUpcomingChapters: IUpcomingChapter[] = [
  {
    id: 1,
    courseTitle: "JavaScript Basics",
    chapterTitle: "Loops and Iteration",
  },
  {
    id: 2,
    courseTitle: "Advanced React",
    chapterTitle: "Context API Deep Dive",
  },
];

export const mockRecentCourses: IRecentCourse[] = [
  { id: 1, title: "JavaScript Basics", progress: 40 },
  { id: 2, title: "Advanced React", progress: 70 },
];
