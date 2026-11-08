import {
  Alert,
  Button,
  Card,
  Flex,
  List,
  Popconfirm,
  Progress,
  Result,
  Space,
  Spin,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  LockOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { EnrollmentStatusTag } from "../../components/enrollment/EnrollmentTags.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useAbandonEnrollmentMutation,
  useEnrollMutation,
  useGetCourseEnrollmentQuery,
  useGetEnrollmentQuery,
  useRestoreEnrollmentMutation,
} from "../../api/enrollment.api.ts";
import type { IItemProgress } from "../../constants/interfaces/enrollment.interfaces.ts";
import { getDMY } from "../../utils/date.ustils.ts";

const { Text } = Typography;

/**
 * /learning/:courseId — an enrolled student's view of a course: progress, and every chapter / exam
 * with done / available / locked. Shows the user's latest enrollment in the course.
 */
export function LearningPage() {
  const { courseId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const { data: current, isLoading: isLoadingCurrent } = useGetCourseEnrollmentQuery(courseId);
  const { data: detail, isLoading: isLoadingDetail } = useGetEnrollmentQuery(
    current ? current.id : skipToken,
  );
  const [abandon, { isLoading: isAbandoning }] = useAbandonEnrollmentMutation();
  const [restore, { isLoading: isRestoring }] = useRestoreEnrollmentMutation();
  const [enroll, { isLoading: isEnrolling }] = useEnrollMutation();

  if (isLoadingCurrent || isLoadingDetail) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (!current || !detail) {
    return (
      <Result
        status="info"
        title={formatMessage({ id: "not-enrolled" })}
        extra={
          <Button type="primary" onClick={() => navigate(routes.courseById(courseId))}>
            {formatMessage({ id: "view-course" })}
          </Button>
        }
      />
    );
  }

  const { enrollment, items } = detail;
  const isActive = enrollment.status !== "abandoned" && !enrollment.courseDisabled;

  const openItem = (item: IItemProgress) => {
    if (!isActive || item.state === "locked") {
      return;
    }
    if (item.itemType === "chapter" && item.chapterId) {
      navigate(routes.learningChapter(courseId, item.chapterId));
    } else if (item.itemType === "exam" && item.examId) {
      navigate(routes.learningExam(courseId, item.examId));
    }
  };

  const stateIcon = (item: IItemProgress) => {
    if (item.state === "done") {
      return <CheckCircleFilled style={{ fontSize: 20, color: token.colorSuccess }} />;
    }
    if (item.state === "available") {
      return <PlayCircleFilled style={{ fontSize: 20, color: token.colorPrimary }} />;
    }
    return <LockOutlined style={{ fontSize: 20, color: token.colorTextQuaternary }} />;
  };

  return (
    <div>
      <PageTitle showBackButton>{enrollment.courseName ?? formatMessage({ id: "course" })}</PageTitle>

      {enrollment.courseDisabled && (
        <Alert type="error" showIcon style={{ marginBottom: 16 }}
               message={formatMessage({ id: "course-unavailable" })} />
      )}
      {enrollment.status === "abandoned" && (
        <Alert type="info" showIcon style={{ marginBottom: 16 }}
               message={formatMessage({ id: "course-left-notice" })} />
      )}

      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Flex justify="space-between" align="center" wrap gap={16}>
          <Space direction="vertical" size={4} style={{ minWidth: 240, flex: 1 }}>
            <Space wrap>
              <EnrollmentStatusTag status={enrollment.status} />
              <Text type="secondary">
                {formatMessage({ id: "enrolled-on" }, { date: getDMY(enrollment.enrolledAt) })}
              </Text>
            </Space>
            <Progress
              percent={enrollment.progressPercent}
              status={enrollment.status === "completed" ? "success" : "active"}
            />
            <Text type="secondary">
              {formatMessage(
                { id: "progress-of" },
                { done: enrollment.doneCount, total: enrollment.totalCount },
              )}
            </Text>
          </Space>

          <Space wrap>
            {isActive && enrollment.nextItem && (
              <Button type="primary" size="large" onClick={() => openItem(enrollment.nextItem!)}>
                {formatMessage({ id: "continue-course" })}
              </Button>
            )}
            {enrollment.status === "active" && (
              <Popconfirm
                title={formatMessage({ id: "leave-course" })}
                description={formatMessage({ id: "leave-course-confirm" })}
                okText={formatMessage({ id: "leave-course" })}
                cancelText={formatMessage({ id: "cancel" })}
                onConfirm={() => abandon(enrollment.id)}
              >
                <Button danger loading={isAbandoning}>
                  {formatMessage({ id: "leave-course" })}
                </Button>
              </Popconfirm>
            )}
            {enrollment.status === "abandoned" && !enrollment.courseDisabled && (
              <Button type="primary" size="large" loading={isRestoring}
                      onClick={() => restore(enrollment.id)}>
                {formatMessage({ id: "restore-course" })}
              </Button>
            )}
            {enrollment.status === "completed" && !enrollment.courseDisabled && (
              <Button loading={isEnrolling} onClick={() => enroll(courseId)}>
                {formatMessage({ id: "enroll-again" })}
              </Button>
            )}
            <Button onClick={() => navigate(routes.courseById(courseId))}>
              {formatMessage({ id: "view-course" })}
            </Button>
          </Space>
        </Flex>
        {enrollment.status === "completed" && (
          <Alert type="success" showIcon style={{ marginTop: 16 }}
                 message={formatMessage({ id: "course-completed-message" })} />
        )}
      </Card>

      <Card
        variant="borderless"
        title={formatMessage({ id: "course-content" })}
        style={{ marginTop: 24, borderRadius: 16 }}
      >
        <List
          dataSource={items}
          locale={{ emptyText: formatMessage({ id: "no-course-items" }) }}
          renderItem={(item) => {
            const clickable = isActive && item.state !== "locked";
            return (
              <List.Item
                style={{ cursor: clickable ? "pointer" : "default", opacity: item.state === "locked" ? 0.6 : 1 }}
                onClick={() => openItem(item)}
              >
                <List.Item.Meta
                  avatar={stateIcon(item)}
                  title={item.title}
                  description={
                    <Space size={4} wrap>
                      <Tag color={item.itemType === "chapter" ? "blue" : "orange"}>
                        {formatMessage({ id: item.itemType })}
                      </Tag>
                      {item.state === "locked" && (
                        <Text type="secondary">{formatMessage({ id: "item-locked" })}</Text>
                      )}
                      {item.removed && <Tag>{formatMessage({ id: "item-removed" })}</Tag>}
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
