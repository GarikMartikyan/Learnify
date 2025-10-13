import { Card, Divider, Flex, Space, Tabs, Tag, Typography } from "antd";
import { GlobalOutlined, MailOutlined } from "@ant-design/icons";
import { ParagraphInfo } from "../components/shared/ParagraphInfo.tsx";
import { ProfileInfoTab } from "../components/profile/ProfileInfoTab.tsx";
import { CoursesTab } from "../components/profile/CoursesTab.tsx";
import { UserAvatar } from "../components/shared/UserAvatar.tsx";
import { user } from "../utils/index.utils.ts";
import { courses } from "../placeholder/courses.ts";
import { useIntl } from "react-intl";

const { Title, Text } = Typography;

export function UserProfilePage() {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Flex align={"center"} gap={24} wrap={"wrap"}>
          <UserAvatar size={100} />
          <Space direction="vertical">
            <Space>
              <Title level={3} style={{ margin: 0 }}>
                {user.name}
              </Title>
              <Tag color={user.role === "teacher" ? "blue" : "green"}>
                {user.role}
              </Tag>
            </Space>
            <ParagraphInfo icon={<MailOutlined />} text={user.email} />
            <ParagraphInfo icon={<GlobalOutlined />} text={user.country} />
          </Space>
        </Flex>

        <Divider />

        <Text type="secondary" style={{ fontSize: 16 }}>
          {user.bio}
        </Text>
      </Card>

      {/* Tabs Section */}
      <Card
        variant="borderless"
        style={{
          marginTop: 32,
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: "profile",
              label: formatMessage({ id: "profile-info" }),
              children: <ProfileInfoTab user={user} />,
            },
            {
              key: "courses",
              label: formatMessage({ id: "passed-courses" }),
              children: <CoursesTab courses={courses} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
