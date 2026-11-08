import { Button, Divider, Flex, Result, Spin, Typography, message } from "antd";
import { ArrowRightOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { ContentBlockView } from "../../components/courses/ContentBlockView.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useGetCourseEnrollmentQuery,
  useOpenChapterQuery,
} from "../../api/enrollment.api.ts";

const { Text } = Typography;

/**
 * /learning/:courseId/chapters/:chapterId — an enrolled student reads a chapter.
 * Opening it marks it as viewed; "Next" leads to the next item to do.
 */
export function LearningChapterPage() {
  const { courseId = "", chapterId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const { data: current, isLoading: isLoadingCurrent } = useGetCourseEnrollmentQuery(courseId);
  const { data, isLoading, isError } = useOpenChapterQuery(
    current ? { enrollmentId: current.id, chapterId } : skipToken,
  );

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

  const { chapter, enrollment } = data;
  const next = enrollment.nextItem;

  const goNext = () => {
    if (next?.itemType === "chapter" && next.chapterId) {
      navigate(routes.learningChapter(courseId, next.chapterId));
    } else {
      if (next?.itemType === "exam") {
        message.info(formatMessage({ id: "exams-coming" }));
      }
      navigate(routes.learning(courseId));
    }
  };

  return (
    <div>
      <PageTitle showBackButton backRoute={routes.learning(courseId)}>
        {chapter.title}
      </PageTitle>
      <div>
        <Text type="secondary">{chapter.courseName}</Text>
      </div>
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
        {next && next.chapterId !== chapter.id ? (
          <Button type="primary" icon={<ArrowRightOutlined />} iconPosition="end" onClick={goNext}>
            {formatMessage({ id: "next-item" }, { title: next.title })}
          </Button>
        ) : (
          !next && (
            <Text type="success" strong>
              {formatMessage({ id: "course-completed-message" })}
            </Text>
          )
        )}
      </Flex>
    </div>
  );
}
