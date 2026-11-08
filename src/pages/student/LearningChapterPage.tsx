import { Button, Divider, Flex, Result, Spin, Tag, Typography, message } from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { ContentBlockView } from "../../components/courses/ContentBlockView.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useFinishChapterMutation,
  useGetCourseEnrollmentQuery,
  useOpenChapterQuery,
} from "../../api/enrollment.api.ts";
import type { IItemProgress } from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text } = Typography;

/**
 * /learning/:courseId/chapters/:chapterId — an enrolled student reads a chapter.
 * The chapter is done only when the student clicks "Mark as finished" at the end.
 */
export function LearningChapterPage() {
  const { courseId = "", chapterId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const { data: current, isLoading: isLoadingCurrent } = useGetCourseEnrollmentQuery(courseId);
  const { data, isLoading, isError } = useOpenChapterQuery(
    current ? { enrollmentId: current.id, chapterId } : skipToken,
  );
  const [finishChapter, { isLoading: isFinishing }] = useFinishChapterMutation();

  if (isLoadingCurrent || isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (!current || isError || !data) {
    return (
      <Result
        status="warning"
        title={formatMessage({ id: "chapter-not-available" })}
        extra={
          <Button onClick={() => navigate(routes.learning(courseId))}>
            {formatMessage({ id: "back-to-course" })}
          </Button>
        }
      />
    );
  }

  const { chapter, done, enrollment } = data;

  /** Opens the next chapter or exam, or the course's learning view when everything is done. */
  const goTo = (next: IItemProgress | null) => {
    if (next?.itemType === "chapter" && next.chapterId) {
      navigate(routes.learningChapter(courseId, next.chapterId));
    } else if (next?.itemType === "exam" && next.examId) {
      navigate(routes.learningExam(courseId, next.examId));
    } else {
      navigate(routes.learning(courseId));
    }
  };

  const handleFinish = async () => {
    const result = await finishChapter({ enrollmentId: current.id, chapterId });
    if (result.data) {
      if (result.data.status === "completed") {
        message.success(formatMessage({ id: "course-completed-message" }));
      }
      goTo(result.data.nextItem);
    }
  };

  const next = enrollment.nextItem;

  return (
    <div>
      <PageTitle showBackButton backRoute={routes.learning(courseId)}>
        {chapter.title}
      </PageTitle>
      <Flex gap={8} align="center">
        <Text type="secondary">{chapter.courseName}</Text>
        {done && <Tag color="success">{formatMessage({ id: "chapter-finished" })}</Tag>}
      </Flex>
      <Divider />

      {chapter.blocks.length === 0 ? (
        <Text type="secondary">{formatMessage({ id: "no-blocks" })}</Text>
      ) : (
        <Flex vertical gap="large">
          {chapter.blocks.map((block) => (
            <ContentBlockView key={block.id} block={block} />
          ))}
        </Flex>
      )}

      <Divider />
      <Flex justify="space-between" wrap gap={8}>
        <Button icon={<UnorderedListOutlined />} onClick={() => navigate(routes.learning(courseId))}>
          {formatMessage({ id: "back-to-course" })}
        </Button>
        {!done ? (
          <Button type="primary" size="large" icon={<CheckOutlined />} loading={isFinishing}
                  onClick={handleFinish}>
            {formatMessage({ id: "mark-chapter-finished" })}
          </Button>
        ) : (
          next && (
            <Button type="primary" icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => goTo(next)}>
              {formatMessage({ id: "next-item" }, { title: next.title })}
            </Button>
          )
        )}
      </Flex>
    </div>
  );
}
