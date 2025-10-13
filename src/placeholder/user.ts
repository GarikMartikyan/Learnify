import type { IUser } from "../constants/interfaces/user.interfaces.ts";

export const users: IUser[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@learnify.com",
    role: "teacher",
    bio: "Frontend developer and React instructor with 5+ years of experience.",
    avatarUrl:
      "https://images.pexels.com/photos/34144970/pexels-photo-34144970.jpeg",
    country: "United States",
    createdAt: "2025-01-12T10:00:00Z",
    joinedAt: "2025-01-15T09:00:00Z",
  },
  {
    id: 2,
    name: "Mark Petrosyan",
    email: "mark.petrosyan@learnify.com",
    role: "teacher",
    bio: "Software engineer specializing in backend development and NestJS.",
    avatarUrl:
      "https://images.pexels.com/photos/34095852/pexels-photo-34095852.jpeg",
    country: "Armenia",
    createdAt: "2025-02-18T12:30:00Z",
    joinedAt: "2025-02-20T11:00:00Z",
  },
  {
    id: 3,
    name: "Lily Brown",
    email: "lily.brown@learnify.com",
    role: "student",
    bio: "Passionate about learning frontend development and UI/UX design.",
    avatarUrl:
      "https://images.pexels.com/photos/34123164/pexels-photo-34123164.jpeg",
    country: "United Kingdom",
    createdAt: "2025-03-01T09:45:00Z",
    joinedAt: "2025-03-02T14:00:00Z",
  },
  {
    id: 4,
    name: "Aram Hovhannisyan",
    email: "aram.hovhannisyan@learnify.com",
    role: "student",
    bio: "Interested in full-stack development and building side projects.",
    avatarUrl:
      "https://images.pexels.com/photos/34144970/pexels-photo-34144970.jpeg",
    country: "Armenia",
    createdAt: "2025-03-20T15:10:00Z",
    joinedAt: "2025-03-21T10:00:00Z",
  },
  {
    id: 5,
    name: "Sophia Williams",
    email: "sophia.williams@learnify.com",
    role: "student",
    bio: "Loves exploring JavaScript frameworks and creating small apps.",
    avatarUrl:
      "https://images.pexels.com/photos/11556377/pexels-photo-11556377.jpeg",
    country: "Canada",
    createdAt: "2025-04-04T18:22:00Z",
    joinedAt: "2025-04-05T09:30:00Z",
  },
  {
    id: 6,
    name: "David Hakobyan",
    email: "david.hakobyan@learnify.com",
    role: "teacher",
    bio: "Database expert and SQL instructor passionate about teaching data systems.",
    avatarUrl:
      "https://images.pexels.com/photos/34144970/pexels-photo-34144970.jpeg",
    country: "Armenia",
    createdAt: "2025-02-02T08:00:00Z",
    joinedAt: "2025-02-03T10:15:00Z",
  },
];
export const student = users.find((user) => user.role === "student")!;
export const teacher = users.find((user) => user.role === "teacher")!;
