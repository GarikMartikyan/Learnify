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

/** PATCH /users/me — only the fields that are sent are changed. Send bio "" to clear it. */
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
