import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  List,
  Result,
  Space,
  Spin,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  BookOutlined,
  EditOutlined,
  FileDoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import {
  CourseLanguageTag,
  CourseLevelTag,
  CourseStatusTag,
} from "../components/courses/CourseTags.tsx";
import { routes } from "../constants/routes.ts";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";
import {
  useGetAdminCourseQuery,
  useGetMyCourseQuery,
  useGetPublicCourseQuery,
} from "../api/course.api.ts";
import type { ICourseItem } from "../constants/interfaces/courseApi.interfaces.ts";
import { EnrollmentActions } from "../components/enrollment/EnrollmentActions.tsx";
import { CourseRatingSummary } from "../components/enrollment/CourseRating.tsx";
import { ReportButton } from "../components/enrollment/ReportButton.tsx";

const { Title, Text, Paragraph } = Typography;

/**
 * /courses/:courseId — a course's overview and its chapters / exams.
 * Admins see any course (also drafts and disabled ones); everyone else sees published courses.
 */
export function CourseDetailsPage() {
  const { token } = theme.useToken();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { courseId = "" } = useParams();
  const { user, role } = useCurrentUser();
  const isAdmin = role === "admin";

  // ?preview: a teacher previews their own course, also when it is not published (draft, archived, disabled)
  const [searchParams] = useSearchParams();
  const isPreview = role === "teacher" && searchParams.has("preview");

  const publicQuery = useGetPublicCourseQuery(courseId, { skip: isAdmin || isPreview });
  const adminQuery = useGetAdminCourseQuery(courseId, { skip: !isAdmin });
  const previewQuery = useGetMyCourseQuery(courseId, { skip: !isPreview });
  const { data, isLoading } = isAdmin ? adminQuery : isPreview ? previewQuery : publicQuery;

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (!data) {
    return <Result status="404" title={formatMessage({ id: "course-not-found" })} />;
  }

  const { course, items } = data;
  const isOwner = user?.id === course.teacher.id;
  // Here chapters open for the course's teacher and admins; enrolled students read them from the learning view
  const canOpenChapters = isOwner || isAdmin;
  const teacherName = [course.teacher.firstName, course.teacher.lastName]
    .filter(Boolean)
    .join(" ");

  const openItem = (item: ICourseItem) => {
    if (item.itemType === "chapter" && item.chapterId && canOpenChapters) {
      navigate(routes.chapterById(item.chapterId));
    }
  };

  return (
    <div>
      <PageTitle showBackButton>{course.name}</PageTitle>
      {isPreview && (course.status !== "published" || course.disabled) && (
        <Alert
          type="info"
          showIcon
          message={formatMessage({ id: "course-preview-notice" })}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card
        variant="borderless"
        style={{ overflow: "hidden" }}
        cover={
          course.coverImageUrl && (
            <img
              alt={course.name}
              src={course.coverImageUrl}
              style={{
                width: "100%",
                aspectRatio: "5/2",
                objectFit: "cover",
                borderRadius: token.borderRadiusLG,
              }}
            />
          )
        }
      >
        <Space wrap>
          {course.category && <Tag>{course.category.name}</Tag>}
          <CourseLevelTag level={course.level} />
          <CourseLanguageTag language={course.language} />
          {(isAdmin || isOwner) && (
            <CourseStatusTag status={course.status} disabled={course.disabled} />
          )}
        </Space>

        <Title level={2} style={{ marginTop: 12 }}>
          {course.name}
        </Title>
        <Flex vertical gap={4}>
          {teacherName && (
            <Text type="secondary">
              <UserOutlined /> {teacherName}
            </Text>
          )}
          <CourseRatingSummary courseId={course.id} />
        </Flex>

        <Divider />

        <Paragraph style={{ fontSize: 16, whiteSpace: "pre-wrap" }}>
          {course.description || (
            <Text type="secondary" italic>
              {formatMessage({ id: "no-description" })}
            </Text>
          )}
        </Paragraph>

        <Flex justify="end" align="center" gap={8} wrap>
          {/* Logged-in users (not admins, not the teacher) can report the course */}
          {user && !isAdmin && !isOwner && (
            <ReportButton entityType="course" entityId={course.id} />
          )}
          {isOwner && (
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(routes.myCourseById(course.id))}
            >
              {formatMessage({ id: "edit-course" })}
            </Button>
          )}
          {/* Users and other teachers can join; admins and the course's own teacher cannot */}
          {!isAdmin && !isOwner && course.status === "published" && !course.disabled && (
            <EnrollmentActions courseId={course.id} />
          )}
        </Flex>
      </Card>

      <Card
        variant="borderless"
        title={formatMessage({ id: "course-content" })}
        style={{ marginTop: 24, borderRadius: 16 }}
      >
        <List
          dataSource={items}
          locale={{ emptyText: formatMessage({ id: "no-course-items" }) }}
          renderItem={(item, index) => {
            const clickable = item.itemType === "chapter" && canOpenChapters;
            return (
              <List.Item
                style={{ cursor: clickable ? "pointer" : "default" }}
                onClick={() => openItem(item)}
              >
                <List.Item.Meta
                  avatar={
                    item.itemType === "chapter" ? (
                      <BookOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                    ) : (
                      <FileDoneOutlined style={{ fontSize: 20, color: token.colorWarning }} />
                    )
                  }
                  title={`${index + 1}. ${item.title}`}
                  description={
                    <Space size={4}>
                      <Tag color={item.itemType === "chapter" ? "blue" : "orange"}>
                        {formatMessage({ id: item.itemType })}
                      </Tag>
                      {item.disabled && (
                        <Tag color="red">{formatMessage({ id: "disabled" })}</Tag>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}
