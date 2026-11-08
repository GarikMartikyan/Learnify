import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Progress,
  Row,
  Segmented,
  Spin,
  Typography,
  theme,
} from "antd";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
import type {
  EnrollmentStatus,
  IEnrollment,
} from "../../constants/interfaces/enrollment.interfaces.ts";
import { EnrollmentStatusTag } from "./EnrollmentTags.tsx";

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
      <Segmented<Filter>
        value={filter}
        onChange={setFilter}
        style={{ marginBottom: 16 }}
        options={FILTERS.map((value) => ({
          value,
          label: formatMessage({ id: value === "all" ? "all" : `enrollment-status-${value}` }),
        }))}
      />
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

/** One enrolled course: name, status, progress and what comes next. */
export function EnrollmentCard({ enrollment }: { enrollment: IEnrollment }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      hoverable
      onClick={() => navigate(routes.learning(enrollment.courseId))}
      style={{ height: "100%", background: token.colorBgElevated, boxShadow: token.boxShadowSecondary }}
    >
      <Flex vertical gap="small">
        <Title level={5} ellipsis={{ rows: 1 }} style={{ margin: 0 }}>
          {enrollment.courseName ?? formatMessage({ id: "course" })}
        </Title>
        <div>
          <EnrollmentStatusTag status={enrollment.status} />
        </div>
        <Progress
          percent={enrollment.progressPercent}
          status={enrollment.status === "completed" ? "success" : "normal"}
        />
        <Text type="secondary" ellipsis>
          {enrollment.courseDisabled
            ? formatMessage({ id: "course-unavailable" })
            : enrollment.nextItem
              ? formatMessage({ id: "next-up" }, { title: enrollment.nextItem.title })
              : formatMessage({ id: "progress-of" },
                  { done: enrollment.doneCount, total: enrollment.totalCount })}
        </Text>
      </Flex>
    </Card>
  );
}
