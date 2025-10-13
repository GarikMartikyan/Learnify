import { Button, Result } from "antd";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";

export const NotFoundPage = () => {
  const { formatMessage } = useIntl();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="404"
        title={formatMessage({ id: "not-found-title" })}
        subTitle={formatMessage({ id: "not-found-subtitle" })}
        extra={
          <Link to={routes.dashboard}>
            <Button type="primary">
              {formatMessage({ id: "not-found-back-home" })}
            </Button>
          </Link>
        }
      />
    </div>
  );
};
