import { Layout } from "../components/common/Layout.tsx";
import { useAppSelector } from "../hooks/useAppSelector.ts";
import { selectAccessToken } from "../store/slices/config.slice.ts";
import { Navigate } from "react-router";
import { routes } from "../constants/routes.ts";

export function PrivateRoutes() {
  const accessToken = useAppSelector(selectAccessToken);

  if (!accessToken) {
    return <Navigate to={routes.login} replace />;
  }
  return <Layout />;
}
