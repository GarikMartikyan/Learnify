import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FormInstance } from "antd";
import { message } from "antd";

import { getAccessTokenLS } from "../services/localStorage.service.ts";
import { removeAccessToken } from "../store/slices/config.slice.ts";
import type { IApiError } from "../constants/interfaces/user.interfaces.ts";

/** Base URLs of the backend services. */
export const apiUrls = {
  auth: import.meta.env.VITE_AUTH_API_URL || "http://localhost:8081",
  course: import.meta.env.VITE_COURSE_API_URL || "http://localhost:8082",
  audit: import.meta.env.VITE_AUDIT_API_URL || "http://localhost:8084",
} as const;

/**
 * Base query shared by all service APIs:
 * - sends the access token as "Authorization: Bearer ...";
 * - shows the backend's error message as a toast;
 * - on 401 for a logged-in user (expired/invalid token) logs out, which sends the user to the login page.
 */
export const createBaseQuery = (
  baseUrl: string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAccessTokenLS();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      const isLoggedIn = Boolean(getAccessTokenLS());
      if (result.error.status === 401 && isLoggedIn) {
        api.dispatch(removeAccessToken());
        message.warning("Your session has expired, please log in again");
      } else {
        message.error(getErrorMessage(result.error));
      }
    }
    return result;
  };
};

/** Readable message for any RTK Query error. */
export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) {
    return "Something went wrong";
  }
  if ("status" in error) {
    if (error.status === "FETCH_ERROR") {
      return "Cannot reach the server. Is the backend running?";
    }
    const data = error.data as Partial<IApiError> | undefined;
    if (data?.message) {
      return data.message;
    }
    return `Request failed (${error.status})`;
  }
  return error.message || "Something went wrong";
}

/** Shows the backend's per-field validation errors under the matching form fields. */
export function applyFieldErrors(form: FormInstance, error: unknown) {
  const data = (error as FetchBaseQueryError | undefined)?.data as
    | Partial<IApiError>
    | undefined;
  if (!data?.fieldErrors) {
    return;
  }
  form.setFields(
    Object.entries(data.fieldErrors).map(([name, fieldError]) => ({
      name,
      errors: [fieldError],
    })),
  );
}
