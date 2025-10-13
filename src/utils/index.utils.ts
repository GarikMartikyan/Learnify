import type { IUser } from "../constants/interfaces/user.interfaces.ts";
import { student, teacher } from "../placeholder/user.ts";

export const isDevMode = import.meta.env.VITE_ENV === "development";
export const userRole: IUser["role"] = "student";
export const user = userRole === "student" ? student : teacher;
