import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Result,
  Spin,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useGetCourseEnrollmentQuery,
  useGetExamOverviewQuery,
  useStartAttemptMutation,
} from "../../api/enrollment.api.ts";
import type { IAttemptSummary } from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text } = Typography;

/**
 * /learning/:courseId/exams/:examId — an exam before starting: its rules, start / resume, and the
 * student's previous attempts.
 */
export function LearningExamPage() {
  const { courseId = "", examId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const { data: current, isLoading: isLoadingCurrent } = useGetCourseEnrollmentQuery(courseId);
  const { data: exam, isLoading, isError } = useGetExamOverviewQuery(
    current ? { enrollmentId: current.id, examId } : skipToken,
  );
  const [startAttempt, { isLoading: isStarting }] = useStartAttemptMutation();

  if (isLoadingCurrent || isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (!current || isError || !exam) {
    return (
      <Result
        status="warning"
        title={formatMessage({ id: "exam-not-available" })}
        extra={
          <Button onClick={() => navigate(routes.learning(courseId))}>
            {formatMessage({ id: "back-to-course" })}
          </Button>
        }
      />
    );
  }

  const canTake =
    current.status !== "abandoned" && !current.courseDisabled && exam.state !== "locked";

  const handleStart = async () => {
    const result = await startAttempt({ enrollmentId: current.id, examId });
    if (result.data) {
      navigate(routes.examAttempt(courseId, result.data.id));
    }
  };

  const columns: TableProps<IAttemptSummary>["columns"] = [
    {
      title: formatMessage({ id: "date" }),
      key: "date",
      render: (_, attempt) => dayjs(attempt.submittedAt ?? attempt.startedAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: formatMessage({ id: "score" }),
      key: "score",
      render: (_, attempt) => `${attempt.score} / ${attempt.totalMarks} (${attempt.percent}%)`,
    },
    {
      title: formatMessage({ id: "result" }),
      key: "result",
      render: (_, attempt) =>
        attempt.passed ? (
          <Tag color="success">{formatMessage({ id: "exam-passed" })}</Tag>
        ) : (
          <Tag color="error">{formatMessage({ id: "exam-failed" })}</Tag>
        ),
    },
    {
      key: "view",
      align: "right",
      render: (_, attempt) => (
        <Button size="small" onClick={() => navigate(routes.examAttempt(courseId, attempt.id))}>
          {formatMessage({ id: "view" })}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageTitle showBackButton backRoute={routes.learning(courseId)}>
        {exam.title}
      </PageTitle>
      {exam.courseName && (
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">{exam.courseName}</Text>
        </div>
      )}

      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Descriptions
          column={{ xs: 1, sm: 3 }}
          items={[
            {
              key: "questions",
              label: formatMessage({ id: "questions" }),
              children: exam.questionCount,
            },
            {
              key: "duration",
              label: formatMessage({ id: "duration" }),
              children: formatMessage({ id: "minutes-count" }, { count: exam.durationMinutes }),
            },
            {
              key: "passing",
              label: formatMessage({ id: "passing-percentage" }),
              children: `${exam.passingPercentage}%`,
            },
          ]}
        />

        {exam.passed ? (
          <Alert type="success" showIcon message={formatMessage({ id: "exam-already-passed" })} />
        ) : exam.state === "locked" ? (
          <Alert type="info" showIcon message={formatMessage({ id: "item-locked" })} />
        ) : !canTake ? (
          <Alert type="info" showIcon message={formatMessage({ id: "course-left-notice" })} />
        ) : (
          <Flex vertical gap={12} align="flex-start">
            <Text type="secondary">
              {formatMessage({ id: "exam-rules" }, { minutes: exam.durationMinutes })}
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              loading={isStarting}
              onClick={handleStart}
            >
              {formatMessage({ id: exam.openAttempt ? "resume-exam" : exam.attempts.length ? "retake-exam" : "start-exam" })}
            </Button>
          </Flex>
        )}
      </Card>

      {exam.attempts.length > 0 && (
        <Card
          variant="borderless"
          title={formatMessage({ id: "previous-attempts" })}
          style={{ marginTop: 24, borderRadius: 16 }}
        >
          <Table
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={exam.attempts}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Card>
      )}
    </div>
  );
}
