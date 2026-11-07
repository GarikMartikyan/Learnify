import type {
  AccountStatus,
  Locale,
  ThemeMode,
  UserRole,
} from "../types/index.types.ts";

export interface ICountry {
  id: string;
  name: string;
  code: string;
}

/** A user as returned by the auth service (GET /users/me, GET /admin/users/{id}). */
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  country: ICountry | null;
  preferredLanguage: Locale;
  preferredTheme: ThemeMode;
  bio: string | null;
  /** Temporary (1h) download link of the avatar, or null. */
  avatarUrl: string | null;
  /** False for accounts that only sign in with Google. */
  hasPassword: boolean;
  createdAt: string;
}

/** Response of POST /auth/login and POST /auth/register. */
export interface IAuthResponse {
  accessToken: string;
  /** Token lifetime in seconds. */
  expiresIn: number;
  user: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId?: string;
  preferredLanguage?: Locale;
}

/** PUT /users/me — only the fields that are sent are changed. Send bio "" to clear it. */
export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  countryId?: string;
  preferredLanguage?: Locale;
  preferredTheme?: ThemeMode;
  bio?: string;
}

/** Shape of every error response of the backend services. */
export interface IApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors: Record<string, string> | null;
}

/** One page of a paginated list (page is 0-based). */
export interface IPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

/** Short user info embedded in other responses. */
export interface IUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IApplicationDocument {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface ITeacherApplication {
  id: string;
  applicant: IUserSummary;
  motivation: string;
  status: ApplicationStatus;
  /** Null while pending. */
  reviewedBy: IUserSummary | null;
  reviewedAt: string | null;
  adminNotes: string | null;
  documents: IApplicationDocument[];
  createdAt: string;
  updatedAt: string;
}

/** Old mock-data user shape, still used by the placeholder course/teacher data. */
export interface IMockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  country: string;
  joinedAt: string;
}
