import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Progress,
  Row,
  Segmented,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { CaretRightOutlined, PictureOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
import { useGetCourseOverviewQuery } from "../../api/course.api.ts";
import { CourseLanguageTag, CourseLevelTag } from "../courses/CourseTags.tsx";
import type {
  EnrollmentStatus,
  IEnrollment,
} from "../../constants/interfaces/enrollment.interfaces.ts";
import { EnrollmentStatusTag } from "./EnrollmentTags.tsx";
import { useOpenNextItem } from "../../hooks/useOpenNextItem.ts";

const { Title, Text } = Typography;

type Filter = EnrollmentStatus | "all";
const FILTERS: Filter[] = ["all", "active", "completed", "abandoned"];

/** The user's enrolled courses as cards with progress (My Courses). */
export function EnrolledCourses() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery();

  const shown = enrollments.filter((e) => filter === "all" || e.status === filter);

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (enrollments.length === 0) {
    return (
      <Empty description={formatMessage({ id: "no-enrollments" })}>
        <Button type="primary" onClick={() => navigate(routes.courses)}>
          {formatMessage({ id: "browse-courses" })}
        </Button>
      </Empty>
    );
  }

  return (
    <>
      {/* Own row under the page title, same spacing as the other pages' filters */}
      <div style={{ margin: "0 0 16px" }}>
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((value) => ({
            value,
            label: formatMessage({ id: value === "all" ? "all" : `enrollment-status-${value}` }),
          }))}
        />
      </div>
      {shown.length === 0 ? (
        <Empty description={formatMessage({ id: "no-courses-found" })} />
      ) : (
        <Row gutter={[16, 16]} align="stretch">
          {shown.map((enrollment) => (
            <Col xs={24} sm={12} lg={8} xxl={6} key={enrollment.id}>
              <EnrollmentCard enrollment={enrollment} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

/**
 * One enrolled course: cover, name, teacher, level / language / category, status, progress,
 * what comes next and a continue / review button.
 */
export function EnrollmentCard({ enrollment }: { enrollment: IEnrollment }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const openNext = useOpenNextItem();
  const { token } = theme.useToken();
  const courseName = enrollment.courseName ?? formatMessage({ id: "course" });

  // The enrollment only has the course name; the rest comes from the course service.
  // Archived / disabled / deleted courses are not public (404), so their cards show just the basics.
  const { data: course } = useGetCourseOverviewQuery(enrollment.courseId, {
    skip: !enrollment.courseName,
  });
  const teacherName = course
    ? [course.teacher.firstName, course.teacher.lastName].filter(Boolean).join(" ")
    : "";

  const summary = enrollment.courseDisabled
    ? formatMessage({ id: "course-unavailable" })
    : enrollment.nextItem
      ? formatMessage({ id: "next-up" }, { title: enrollment.nextItem.title })
      : formatMessage(
          { id: "progress-of" },
          { done: enrollment.doneCount, total: enrollment.totalCount },
        );

  // Buttons stop the click so it does not also open the card
  const action = enrollment.courseDisabled ? null : enrollment.status === "active" ? (
    <Button
      type="primary"
      icon={<CaretRightOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        openNext(enrollment);
      }}
    >
      {formatMessage({ id: "continue-course" })}
    </Button>
  ) : enrollment.status === "completed" ? (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        navigate(routes.learning(enrollment.courseId));
      }}
    >
      {formatMessage({ id: "review-course" })}
    </Button>
  ) : null;

  return (
    <Card
      variant="borderless"
      hoverable
      onClick={() => navigate(routes.learning(enrollment.courseId))}
      style={{
        height: "100%",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: token.colorBgElevated,
        boxShadow: token.boxShadowTertiary,
      }}
      styles={{ body: { flex: 1, padding: 20 } }}
      cover={
        <div style={{ position: "relative" }}>
          {course?.coverImageUrl ? (
            <img
              alt={courseName}
              src={course.coverImageUrl}
              style={{ display: "block", width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
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
          )}
          {/* Status on the cover, like a badge */}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <EnrollmentStatusTag status={enrollment.status} />
          </div>
        </div>
      }
    >
      <Flex vertical gap={10} style={{ height: "100%" }}>
        <Title level={5} ellipsis={{ tooltip: courseName }} style={{ margin: 0 }}>
          {courseName}
        </Title>
        {teacherName && (
          <Flex align="center" gap={8} style={{ minWidth: 0 }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              src={course?.teacher.avatarUrl ?? undefined}
              style={{ flexShrink: 0 }}
            />
            <Text type="secondary" ellipsis={{ tooltip: teacherName }}>
              {formatMessage({ id: "course-by" }, { name: teacherName })}
            </Text>
          </Flex>
        )}
        {course && (
          <Flex wrap style={{ rowGap: 6 }}>
            <CourseLevelTag level={course.level} />
            <CourseLanguageTag language={course.language} />
            {course.category && <Tag>{course.category.name}</Tag>}
          </Flex>
        )}
        <Progress
          percent={enrollment.progressPercent}
          status={enrollment.status === "completed" ? "success" : "normal"}
        />
        <Text type="secondary" ellipsis={{ tooltip: summary }}>
          {summary}
        </Text>
        {/* Kept at the bottom so the buttons line up across cards of different heights */}
        {action && <div style={{ marginTop: "auto" }}>{action}</div>}
      </Flex>
    </Card>
  );
}
