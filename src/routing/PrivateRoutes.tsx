import { Button, Flex, Result, Spin } from "antd";
import { Navigate } from "react-router";
import { Layout } from "../components/common/Layout.tsx";
import { routes } from "../constants/routes.ts";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

/** Pages that need a logged-in user. Waits until the user is loaded from the backend. */
export function PrivateRoutes() {
  const { user, isLoggedIn, isLoading, refetch } = useCurrentUser();

  if (!isLoggedIn) {
    return <Navigate to={routes.login} replace />;
  }
  if (isLoading) {
    return (
      <Flex style={{ minHeight: "100vh" }} justify="center" align="center">
        <Spin size="large" />
      </Flex>
    );
  }
  if (!user) {
    // e.g. the backend is not reachable (a 401 logs out and redirects above)
    return (
      <Result
        status="warning"
        title="Could not load your account"
        subTitle="The server may be unavailable. Please try again."
        extra={<Button onClick={() => refetch()}>Retry</Button>}
      />
    );
  }
  return <Layout />;
}
