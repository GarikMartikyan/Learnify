import React from "react";
import { Avatar, Card, Flex, Rate, Space, Tag, theme, Typography } from "antd";
import { GlobalOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";

const { Title, Text, Paragraph } = Typography;

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  level: "beginner" | "intermediate" | "advanced";
  startDate: string; // ISO date string
  language: string;
  teacherName: string;
  teacherImage?: string;
  onCLick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  level,
  language,
  teacherName,
  teacherImage,
  onCLick,
}) => {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  return (
    <Card
      variant="borderless"
      onClick={onCLick}
      style={{
        background: token.colorBgElevated,
        boxShadow: token.boxShadowSecondary,
        overflow: "hidden",
        cursor: "pointer",
        margin: "auto",
        height: "100%",
      }}
    >
      <Flex
        vertical
        gap={"small"}
        justify={"space-between"}
        style={{ width: "100%", height: "100%" }}
      >
        <Title style={{ height: 25 }} level={4} ellipsis={{ rows: 1 }}>
          {title}
        </Title>
        <Space>
          <Avatar
            size={"small"}
            icon={<UserOutlined />}
            src={teacherImage || undefined}
          />
          <Text type="secondary">
            {formatMessage({ id: "course-by" }, { name: teacherName })}
          </Text>
        </Space>
        <Paragraph style={{ height: 70 }} ellipsis={{ rows: 3 }}>
          {description}
        </Paragraph>

        <Space size="small" wrap>
          <Tag
            color={
              level === "beginner"
                ? "green"
                : level === "intermediate"
                  ? "gold"
                  : "volcano"
            }
          >
            {formatMessage({ id: level })}
          </Tag>
          <Tag color={"blue"} icon={<GlobalOutlined />}>
            {language}
          </Tag>
        </Space>
      </Flex>
      <Rate
        disabled
        style={{ marginBlock: 10 }}
        value={Math.floor(Math.random() * 5) + 3}
      />
    </Card>
  );
};
