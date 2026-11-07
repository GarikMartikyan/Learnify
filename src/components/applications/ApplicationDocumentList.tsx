import { Button, List, Typography } from "antd";
import { FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import type { IApplicationDocument } from "../../constants/interfaces/user.interfaces.ts";
import { useLazyGetApplicationDocumentUrlQuery } from "../../api/auth.api.ts";

const { Text } = Typography;

interface ApplicationDocumentListProps {
  applicationId: string;
  documents: IApplicationDocument[];
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Files of a teacher application; "Open" shows the file in a new browser tab. */
export function ApplicationDocumentList({
  applicationId,
  documents,
}: ApplicationDocumentListProps) {
  const { formatMessage } = useIntl();
  const [getDocumentUrl] = useLazyGetApplicationDocumentUrlQuery();

  const openDocument = async (documentId: string) => {
    // Open the tab right away (inside the click), otherwise the browser blocks it as a pop-up
    const newTab = window.open("", "_blank");
    try {
      const { url } = await getDocumentUrl({ applicationId, documentId }).unwrap();
      if (newTab) {
        newTab.location.href = url;
      }
    } catch {
      // The error message is shown as a toast by the base query
      newTab?.close();
    }
  };

  return (
    <List
      size="small"
      bordered
      dataSource={documents}
      renderItem={(document) => (
        <List.Item
          actions={[
            <Button
              key="open"
              type="link"
              onClick={() => openDocument(document.id)}
            >
              {formatMessage({ id: "open-document" })}
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={
              document.mimeType === "application/pdf" ? (
                <FilePdfOutlined style={{ fontSize: 20 }} />
              ) : (
                <FileImageOutlined style={{ fontSize: 20 }} />
              )
            }
            title={document.fileName}
            description={<Text type="secondary">{formatSize(document.fileSize)}</Text>}
          />
        </List.Item>
      )}
    />
  );
}
