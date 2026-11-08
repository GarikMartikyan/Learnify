import { Avatar, Card, Flex, Space, Tag, theme, Typography } from "antd";
import {
  BookOutlined,
  FileDoneOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { ICourseSummary } from "../../constants/interfaces/courseApi.interfaces.ts";
import {
  CourseLanguageTag,
  CourseLevelTag,
} from "../courses/CourseTags.tsx";

const { Title, Text, Paragraph } = Typography;

interface CourseCardProps {
  course: ICourseSummary;
  onClick?: () => void;
}

/** A course in the catalog grid: cover, name, teacher, description, level, language, category, counts. */
export function CourseCard({ course, onClick }: CourseCardProps) {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const teacherName = [course.teacher.firstName, course.teacher.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      variant="borderless"
      onClick={onClick}
      style={{
        background: token.colorBgElevated,
        boxShadow: token.boxShadowSecondary,
        overflow: "hidden",
        cursor: "pointer",
        height: "100%",
      }}
      styles={{ body: { padding: 16 } }}
      cover={
        course.coverImageUrl ? (
          <img
            alt={course.name}
            src={course.coverImageUrl}
            style={{ aspectRatio: "16/9", objectFit: "cover" }}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            style={{
              aspectRatio: "16/9",
              background: token.colorFillTertiary,
              fontSize: 40,
              color: token.colorTextQuaternary,
            }}
          >
            <PictureOutlined />
          </Flex>
        )
      }
    >
      <Flex vertical gap="small">
        <Title level={4} ellipsis={{ rows: 1 }} style={{ margin: 0 }}>
          {course.name}
        </Title>
        {teacherName && (
          <Space>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              src={course.teacher.avatarUrl ?? undefined}
            />
            <Text type="secondary">
              {formatMessage({ id: "course-by" }, { name: teacherName })}
            </Text>
          </Space>
        )}
        <Paragraph
          type="secondary"
          style={{ minHeight: 44, margin: 0 }}
          ellipsis={{ rows: 2 }}
        >
          {course.description}
        </Paragraph>
        <Space size={4} wrap>
          <CourseLevelTag level={course.level} />
          <CourseLanguageTag language={course.language} />
          {course.category && <Tag>{course.category.name}</Tag>}
        </Space>
        <Space size="middle">
          <Text type="secondary">
            <BookOutlined />{" "}
            {formatMessage(
              { id: "chapter-count" },
              { count: course.chapterCount },
            )}
          </Text>
          <Text type="secondary">
            <FileDoneOutlined />{" "}
            {formatMessage({ id: "exam-count" }, { count: course.examCount })}
          </Text>
        </Space>
      </Flex>
    </Card>
  );
}
