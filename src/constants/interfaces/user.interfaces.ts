export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "superuser";
  passwordHash?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  country: string;
  joinedAt: string;
}
