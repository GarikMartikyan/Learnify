import { Avatar, Card, Flex, Space, Tag, theme, Typography } from "antd";
import {
  BookOutlined,
  FileDoneOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { ICourseSummary } from "../../constants/interfaces/courseApi.interfaces.ts";
import type { IRatingSummary } from "../../constants/interfaces/enrollment.interfaces.ts";
import { RatingStars } from "../enrollment/CourseRating.tsx";
import {
  CourseLanguageTag,
  CourseLevelTag,
} from "../courses/CourseTags.tsx";

const { Title, Text, Paragraph } = Typography;

interface CourseCardProps {
  course: ICourseSummary;
  /** Average rating from the Enrollment service; undefined = no ratings yet. */
  rating?: IRatingSummary;
  onClick?: () => void;
}

/** A course in the catalog grid: cover, name, teacher, description, level, language, category, counts. */
export function CourseCard({ course, rating, onClick }: CourseCardProps) {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const teacherName = [course.teacher.firstName, course.teacher.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      variant="borderless"
      hoverable
      onClick={onClick}
      style={{
        background: token.colorBgElevated,
        boxShadow: token.boxShadowTertiary,
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
      }}
      styles={{ body: { padding: 20 } }}
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
        <Title level={5} ellipsis={{ rows: 1, tooltip: course.name }} style={{ margin: 0 }}>
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
        {/* Tags carry their own right margin, so the row only adds the gap between lines */}
        <Flex wrap style={{ rowGap: 6 }}>
          <CourseLevelTag level={course.level} />
          <CourseLanguageTag language={course.language} />
          {course.category && <Tag>{course.category.name}</Tag>}
        </Flex>
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
        <RatingStars summary={rating} />
      </Flex>
    </Card>
  );
}
