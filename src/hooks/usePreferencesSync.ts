import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "./useCurrentUser.ts";
import { setLocale, setThemeMode } from "../store/slices/config.slice.ts";

/**
 * When a user logs in (or the app opens with a saved session), switch the UI
 * to that user's saved language and theme. Runs once per user, so later changes
 * made with the header switches are not overwritten.
 */
export function usePreferencesSync() {
  const { user } = useCurrentUser();
  const dispatch = useDispatch();
  const appliedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      appliedForUserId.current = null;
      return;
    }
    if (appliedForUserId.current === user.id) {
      return;
    }
    appliedForUserId.current = user.id;
    dispatch(setLocale(user.preferredLanguage));
    dispatch(setThemeMode(user.preferredTheme));
  }, [user, dispatch]);
}
