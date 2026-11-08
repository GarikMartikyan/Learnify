import type { ReactNode } from "react";
import { Card, Collapse, Flex, theme, Typography } from "antd";
import {
  BookOutlined,
  CustomerServiceOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { PageTitle } from "../components/shared/PageTitle.tsx";

const { Paragraph, Text, Title } = Typography;

interface HelpSection {
  key: string;
  icon: ReactNode;
  /** Questions of the section; texts are "help.<section>.<question>.q" / ".a". */
  questions: string[];
}

const helpSections: HelpSection[] = [
  {
    key: "account",
    icon: <UserOutlined />,
    questions: ["create-account", "forgot-password", "change-password", "google"],
  },
  {
    key: "profile",
    icon: <SettingOutlined />,
    questions: ["edit-profile", "language-theme"],
  },
  {
    key: "learning",
    icon: <ReadOutlined />,
    questions: ["enroll", "progress", "exams", "leave-course"],
  },
  {
    key: "teaching",
    icon: <BookOutlined />,
    questions: ["become-teacher", "create-course"],
  },
];

/** Help center: frequently asked questions grouped by topic. */
export function Help() {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();

  return (
    <div style={{ maxWidth: 900 }}>
      <PageTitle>{formatMessage({ id: "help-page-title" })}</PageTitle>
      <Paragraph type="secondary" style={{ fontSize: 16 }}>
        {formatMessage({ id: "help-intro" })}
      </Paragraph>

      <Flex vertical gap={28} style={{ marginTop: 24 }}>
        {helpSections.map((section) => (
          <section key={section.key}>
            <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 18, color: token.colorPrimary }}>
                {section.icon}
              </span>
              <Title level={4} style={{ margin: 0 }}>
                {formatMessage({ id: `help.${section.key}.title` })}
              </Title>
            </Flex>

            <Collapse
              expandIconPosition="end"
              items={section.questions.map((question) => {
                const id = `help.${section.key}.${question}`;
                return {
                  key: question,
                  label: <Text strong>{formatMessage({ id: `${id}.q` })}</Text>,
                  children: (
                    <Paragraph style={{ margin: 0, lineHeight: 1.7 }}>
                      {formatMessage({ id: `${id}.a` })}
                    </Paragraph>
                  ),
                };
              })}
            />
          </section>
        ))}

        <Card style={{ borderRadius: 12, background: token.colorFillQuaternary }}>
          <Flex align="center" gap={16}>
            <CustomerServiceOutlined style={{ fontSize: 28, color: token.colorPrimary }} />
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {formatMessage({ id: "help.support.title" })}
              </Text>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {formatMessage({ id: "help.support.text" })}
              </Paragraph>
            </div>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
