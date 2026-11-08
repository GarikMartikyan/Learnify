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
  Typography,
  theme,
} from "antd";
import { CaretRightOutlined, ReadOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
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

/** One enrolled course: name, status, progress, what comes next and a continue / review button. */
export function EnrollmentCard({ enrollment }: { enrollment: IEnrollment }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const openNext = useOpenNextItem();
  const { token } = theme.useToken();
  const courseName = enrollment.courseName ?? formatMessage({ id: "course" });

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
        background: token.colorBgElevated,
        boxShadow: token.boxShadowTertiary,
      }}
      styles={{ body: { height: "100%", padding: 20 } }}
    >
      <Flex vertical gap={12} style={{ height: "100%" }}>
        <Flex align="center" gap={12}>
          <Avatar
            shape="square"
            size={40}
            icon={<ReadOutlined />}
            style={{
              flexShrink: 0,
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
            }}
          />
          <Flex vertical gap={4} style={{ minWidth: 0 }}>
            <Title level={5} ellipsis={{ tooltip: courseName }} style={{ margin: 0 }}>
              {courseName}
            </Title>
            <div>
              <EnrollmentStatusTag status={enrollment.status} />
            </div>
          </Flex>
        </Flex>
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
