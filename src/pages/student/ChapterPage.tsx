import { Alert, Button, Divider, Flex, Result, Spin, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { ContentBlockView } from "../../components/courses/ContentBlockView.tsx";
import { useGetChapterQuery } from "../../api/course.api.ts";
import { routes } from "../../constants/routes.ts";

const { Text } = Typography;

/**
 * /chapters/:chapterId — reading a chapter.
 * For now the course's own teacher and admins can open chapters (students: with the Enrollment service).
 */
export function ChapterPage() {
  const { chapterId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: chapter, isLoading, isError } = useGetChapterQuery(chapterId);

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (isError || !chapter) {
    return <Result status="404" title={formatMessage({ id: "chapter-not-found" })} />;
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle showBackButton>{chapter.title}</PageTitle>
        {chapter.canEdit && (
          <Button icon={<EditOutlined />} onClick={() => navigate(routes.editChapter(chapter.id))}>
            {formatMessage({ id: "edit" })}
          </Button>
        )}
      </Flex>
      <Text type="secondary">{chapter.courseName}</Text>
      {chapter.disabled && (
        <Alert type="error" showIcon style={{ marginTop: 12 }} message={formatMessage({ id: "chapter-disabled" })} />
      )}
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
    </div>
  );
}
