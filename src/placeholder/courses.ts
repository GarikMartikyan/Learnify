import type {
  ICourse,
  ICourseDetails,
} from "../constants/interfaces/course.interfaces.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum CourseLevel {
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
}

export const courses: ICourse[] = [
  {
    id: 1,
    title: "Introduction to React",
    description:
      "Learn the fundamentals of React.js including components, state, and props to build interactive UIs.",
    teacherId: 1, // Alice Johnson
    category: "Frontend Development",
    startDate: "2025-11-01T09:00:00Z",
    language: "English",
    level: CourseLevel.beginner,
    createdAt: "2025-03-01T10:00:00Z",
    image:
      "https://investin.org/cdn/shop/articles/How_to_Motivate_Yourself_to_Study.jpg?v=1640183354",
  },
  {
    id: 2,
    title: "Mastering NestJS",
    description:
      "A practical guide to building scalable backend APIs using NestJS and TypeORM.",
    teacherId: 2, // Mark Petrosyan
    category: "Backend Development",
    startDate: "2025-11-15T10:00:00Z",
    language: "English",
    level: CourseLevel.intermediate,
    createdAt: "2025-03-10T14:30:00Z",
    image:
      "https://iglu.com.au/wp-content/uploads/2024/09/productive-studying.jpg",
  },
  {
    id: 3,
    title: "SQL for Developers",
    description:
      "Understand relational databases, SQL queries, joins, and best practices for PostgreSQL.",
    teacherId: 6, // David Hakobyan
    category: "Databases",
    startDate: "2025-12-01T12:00:00Z",
    language: "Հայերեն",
    level: CourseLevel.beginner,
    createdAt: "2025-04-05T09:15:00Z",
    image:
      "https://ugc.futurelearn.com/uploads/images/4d/c9/4dc9321b-f608-4196-9fb7-02f6c0029a5f.jpg",
  },
  {
    id: 4,
    title: "Advanced TypeScript Patterns",
    description:
      "Master advanced TypeScript concepts including generics, decorators, and advanced typing strategies.",
    teacherId: 2,
    category: "Programming Languages",
    startDate: "2026-01-10T10:00:00Z",
    language: "English",
    level: CourseLevel.advanced,
    createdAt: "2025-05-15T08:30:00Z",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUkmluMeLOj-dZ7gxZXpl209aWVsw7AZiVg&s",
  },
  {
    id: 5,
    title: "Building UI with Ant Design",
    description:
      "Learn to create elegant, responsive UIs using Ant Design components and React.",
    teacherId: 1,
    category: "UI/UX",
    startDate: "2025-11-20T09:30:00Z",
    language: "Հայերեն",
    level: CourseLevel.intermediate,
    createdAt: "2025-06-10T09:00:00Z",
    image:
      "https://www.aeccglobal.my/images/2022/11/08/study-information--technology-abroad.webp",
  },
];

export const courseDetails: ICourseDetails = {
  id: 1,
  title: "Introduction to JavaScript",
  description:
    "This course covers the fundamentals of JavaScript — from basic syntax and data types to DOM manipulation and ES6 features. Perfect for beginners!",
  teacher: "Alice Johnson",
  language: "English",
  startingDate: "2025-10-20",
  category: "Programming",
  image: "https://images.pexels.com/photos/5088193/pexels-photo-5088193.jpeg",
  chapters: [
    { id: 1, title: "Variables and Data Types" },
    { id: 2, title: "Functions and Scope" },
    { id: 3, title: "DOM Manipulation" },
    { id: 4, title: "ES6+ Features" },
  ],
  exams: [
    { id: 1, title: "Quiz 1: Basics of JS" },
    { id: 2, title: "Final Exam" },
  ],
};
