import { Button, Image, Space, Typography } from "antd";
import { DownloadOutlined, LinkOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { IContentBlock } from "../../constants/interfaces/courseApi.interfaces.ts";
import { toYouTubeEmbedUrl } from "../../utils/youtube.utils.ts";

const { Title, Paragraph, Text } = Typography;

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Shows one chapter content block the way a student will see it. */
export function ContentBlockView({ block }: { block: Omit<IContentBlock, "disabled"> }) {
  const { formatMessage } = useIntl();

  switch (block.blockType) {
    case "heading":
      return (
        <Title level={4} style={{ marginTop: 8 }}>
          {block.textContent}
        </Title>
      );
    case "text":
      return (
        <Paragraph style={{ fontSize: 16, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {block.textContent}
        </Paragraph>
      );
    case "image":
      return (
        <div style={{ textAlign: "center" }}>
          {block.fileUrl ? (
            <Image
              src={block.fileUrl}
              alt={block.fileName ?? ""}
              style={{ maxHeight: 500 }}
            />
          ) : (
            <Text type="secondary">{block.fileName}</Text>
          )}
        </div>
      );
    case "file":
      return (
        <Space>
          <Text strong>{block.fileName}</Text>
          <Text type="secondary">{formatSize(block.fileSize)}</Text>
          {block.fileUrl && (
            <Button
              icon={<DownloadOutlined />}
              href={block.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              {formatMessage({ id: "download" })}
            </Button>
          )}
        </Space>
      );
    case "youtube": {
      const embedUrl = block.externalUrl
        ? toYouTubeEmbedUrl(block.externalUrl)
        : null;
      return embedUrl ? (
        <div style={{ maxWidth: 900, marginInline: "auto" }}>
          <iframe
            width="100%"
            style={{ aspectRatio: "16/9", border: 0 }}
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a href={block.externalUrl ?? undefined} target="_blank" rel="noreferrer">
          {block.externalUrl}
        </a>
      );
    }
    case "external_link":
      return (
        <a href={block.externalUrl ?? undefined} target="_blank" rel="noreferrer">
          <LinkOutlined /> {block.externalUrl}
        </a>
      );
    default:
      return null;
  }
}
