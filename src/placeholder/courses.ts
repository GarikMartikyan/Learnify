import type {
  ICourse,
  ICourseDetails,
} from "../constants/interfaces/course.interfaces.ts";

export const courses: ICourse[] = [
  {
    id: 1,
    title: "Introduction to React",
    description:
      "Learn the fundamentals of React.js including components, state, and props to build interactive UIs.",
    teacherId: 1, // Alice Johnson
    category: "Frontend Development",
    level: "beginner",
    startDate: "2025-11-01T09:00:00Z",
    language: "English",
    price: 49.99,
    createdAt: "2025-03-01T10:00:00Z",
    image: "https://images.pexels.com/photos/4778401/pexels-photo-4778401.jpeg",
  },
  {
    id: 2,
    title: "Mastering NestJS",
    description:
      "A practical guide to building scalable backend APIs using NestJS and TypeORM.",
    teacherId: 2, // Mark Petrosyan
    category: "Backend Development",
    level: "intermediate",
    startDate: "2025-11-15T10:00:00Z",
    language: "English",
    price: 59.99,
    createdAt: "2025-03-10T14:30:00Z",
    image: "https://images.pexels.com/photos/5088180/pexels-photo-5088180.jpeg",
  },
  {
    id: 3,
    title: "SQL for Developers",
    description:
      "Understand relational databases, SQL queries, joins, and best practices for PostgreSQL.",
    teacherId: 6, // David Hakobyan
    category: "Databases",
    level: "beginner",
    startDate: "2025-12-01T12:00:00Z",
    language: "Armenian",
    price: 39.99,
    createdAt: "2025-04-05T09:15:00Z",
    image: "https://images.pexels.com/photos/5428013/pexels-photo-5428013.jpeg",
  },
  {
    id: 4,
    title: "Advanced TypeScript Patterns",
    description:
      "Master advanced TypeScript concepts including generics, decorators, and advanced typing strategies.",
    teacherId: 2,
    category: "Programming Languages",
    level: "advanced",
    startDate: "2026-01-10T10:00:00Z",
    language: "English",
    price: 69.99,
    createdAt: "2025-05-15T08:30:00Z",
    image: "https://images.pexels.com/photos/5427651/pexels-photo-5427651.jpeg",
  },
  {
    id: 5,
    title: "Building UI with Ant Design",
    description:
      "Learn to create elegant, responsive UIs using Ant Design components and React.",
    teacherId: 1,
    category: "UI/UX",
    level: "intermediate",
    startDate: "2025-11-20T09:30:00Z",
    language: "English",
    price: 44.99,
    createdAt: "2025-06-10T09:00:00Z",
    image: "https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg",
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
  price: 49.99,
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
