import { Collapse, Typography } from "antd";
import { useIntl } from "react-intl";
import { PageTitle } from "../components/shared/PageTitle.tsx";

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;

const helpPanelData = [
  {
    key: "1",
    headerId: "getting-started",
    contentIds: ["create-account", "login-account"],
  },
  {
    key: "2",
    headerId: "user-settings-title",
    contentIds: ["update-full-name", "change-password"],
  },
  {
    key: "3",
    headerId: "courses-overview",
    contentIds: [
      "enroll-course",
      "teacher-dashboard",
      "student-dashboard",
      "exams-and-quizzes",
    ],
  },
  {
    key: "4",
    headerId: "contact-support",
    contentIds: ["support-details"],
  },
];

export function Help() {
  const { formatMessage } = useIntl();

  const renderPanelContent = (contentIds) => {
    if (contentIds.length === 1 && contentIds[0] === "support-details") {
      return (
        <Paragraph style={{ fontSize: "16px" }}>
          {formatMessage({ id: contentIds[0] })}
        </Paragraph>
      );
    }

    return (
      <ul style={{ paddingLeft: "20px", fontSize: "16px" }}>
        {contentIds.map((id, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px" }}>{formatMessage({ id })}</Text>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <PageTitle style={{ fontSize: "28px" }}>
        {formatMessage({ id: "help-page-title" })}
      </PageTitle>

      <Paragraph style={{ marginBottom: "28px", fontSize: "18px" }}>
        {formatMessage({ id: "help-intro" })}
      </Paragraph>

      <Collapse accordion expandIconPosition="end">
        {helpPanelData.map((panel) => (
          <Panel
            key={panel.key}
            header={
              <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
                {formatMessage({ id: panel.headerId })}
              </Text>
            }
          >
            {renderPanelContent(panel.contentIds)}
          </Panel>
        ))}
      </Collapse>
    </>
  );
}
