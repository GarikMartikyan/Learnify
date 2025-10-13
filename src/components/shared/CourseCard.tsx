import React from "react";
import { Avatar, Card, Flex, Space, Tag, theme, Typography } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";

const { Title, Text, Paragraph } = Typography;

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  level: "beginner" | "intermediate" | "advanced";
  startDate: string; // ISO date string
  language: string;
  price: number;
  teacherName: string;
  teacherImage?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  thumbnailUrl,
  level,
  startDate,
  language,
  price,
  teacherName,
  teacherImage,
  id,
}) => {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  console.log({
    title,
    description,
    thumbnailUrl,
    level,
    startDate,
    language,
    price,
    teacherName,
  });
  const handleCardClick = () => {
    navigate(routes.courseById(String(id)));
  };
  console.log({ teacherImage });
  return (
    <Card
      variant="borderless"
      onClick={handleCardClick}
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

        <Space size="small">
          <CalendarOutlined />{" "}
          <Text>{new Date(startDate).toLocaleDateString()}</Text>
        </Space>

        <Space size="small">
          <DollarOutlined /> <Text strong>${price.toFixed(2)}</Text>
        </Space>
      </Flex>
    </Card>
  );
};
