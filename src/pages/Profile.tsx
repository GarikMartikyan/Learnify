import {
  Button,
  Card,
  Divider,
  Flex,
  Space,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { EditOutlined, GlobalOutlined, MailOutlined } from "@ant-design/icons";
import { ParagraphInfo } from "../components/shared/ParagraphInfo.tsx";
import { ProfileInfoTab } from "../components/profile/ProfileInfoTab.tsx";
import { CoursesTab } from "../components/profile/CoursesTab.tsx";
import { UserAvatar } from "../components/shared/UserAvatar.tsx";
import { user, userRole } from "../utils/index.utils.ts";
import { courses } from "../placeholder/courses.ts";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../constants/routes.ts";

const { Title, Text } = Typography;

export function UserProfilePage() {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const navigator = useNavigate();

  const handleEditClick = () => {
    navigator(routes.settings);
  };
  return (
    <div>
      <div
        style={{
          padding: 20,
        }}
      >
        <Flex style={{ width: "100%" }} justify="space-between" align="start">
          <Flex align={"center"} gap={24} wrap={"wrap"}>
            <UserAvatar size={100} />
            <Space direction="vertical">
              <Space>
                <Title level={3} style={{ margin: 0 }}>
                  {user.name}
                </Title>
                <Tag
                  style={{ paddingInline: 10, paddingBlock: 2 }}
                  color={user.role === "student" ? "green" : "blue"}
                >
                  {userRole}
                </Tag>
              </Space>
              <ParagraphInfo icon={<MailOutlined />} text={user.email} />
              <ParagraphInfo icon={<GlobalOutlined />} text={user.country} />
            </Space>
          </Flex>
          <Button
            onClick={handleEditClick}
            iconPosition="end"
            icon={<EditOutlined />}
          />
        </Flex>
        <Divider />

        <Text type={"secondary"} style={{ fontSize: 16, marginRight: 10 }}>
          {formatMessage({ id: "bio" })}:
        </Text>
        <Text style={{ fontSize: 16 }}>{user.bio}</Text>
      </div>

      {/* Tabs Section */}
      <Card
        style={{
          marginTop: 32,
          borderRadius: 16,
          boxShadow: token.boxShadowTertiary,
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
            ...(userRole === "student"
              ? [
                  {
                    key: "courses",
                    label: formatMessage({ id: "passed-courses" }),
                    children: <CoursesTab courses={courses} />,
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}
