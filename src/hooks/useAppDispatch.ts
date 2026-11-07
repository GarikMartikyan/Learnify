import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store.ts";

/** useDispatch that also accepts RTK Query thunks (e.g. authApi.util.upsertQueryData). */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
