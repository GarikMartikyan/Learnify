import { Button, Space, type SpaceProps, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import type { TitleProps } from "antd/es/typography/Title";
import { useNavigate } from "react-router";

interface PageTitleProps extends TitleProps {
  showBackButton?: boolean;
  backRoute?: string;
  wrapperProps?: SpaceProps;
}

export function PageTitle({
  children,
  showBackButton = false,
  backRoute,
  wrapperProps,
  ...rest
}: PageTitleProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };
  return (
    <Space
      align={"center"}
      {...wrapperProps}
      style={{ marginBottom: 16, ...wrapperProps?.style }}
    >
      {showBackButton && (
        <Button
          variant="filled"
          color={"default"}
          onClick={handleBack}
          icon={<LeftOutlined />}
        />
      )}
      <Typography.Title level={3} style={{ margin: 0 }} {...rest}>
        {children}
      </Typography.Title>
    </Space>
  );
}
