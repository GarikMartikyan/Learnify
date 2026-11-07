import { useAppSelector } from "./useAppSelector.ts";
import { selectAccessToken } from "../store/slices/config.slice.ts";
import { useGetMeQuery } from "../api/auth.api.ts";

/**
 * The logged-in user (loaded from GET /users/me), or undefined when logged out / still loading.
 * Use `role` for role-based UI: "user" | "teacher" | "admin".
 */
export function useCurrentUser() {
  const accessToken = useAppSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);
  const query = useGetMeQuery(undefined, { skip: !isLoggedIn });
  const user = isLoggedIn ? query.data : undefined;

  return {
    user,
    role: user?.role,
    isLoggedIn,
    isLoading: isLoggedIn && query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
