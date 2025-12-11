import type { IUser } from "../constants/interfaces/user.interfaces.ts";
import { student, teacher } from "../placeholder/user.ts";

export const isDevMode = import.meta.env.VITE_ENV === "development";
export const userRole: IUser["role"] = "student";
export const user = userRole === "student" ? student : teacher;
export const isTeacher = userRole === "teacher";
export const isStudent = userRole === "student";
export const isSuperuser = userRole === "superuser";
