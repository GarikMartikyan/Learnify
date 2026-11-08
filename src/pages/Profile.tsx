import {
  Button,
  Card,
  Divider,
  Flex,
  Result,
  Space,
  Spin,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  EditOutlined,
  GlobalOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { ParagraphInfo } from "../components/shared/ParagraphInfo.tsx";
import { ProfileInfoTab } from "../components/profile/ProfileInfoTab.tsx";
import { CoursesTab } from "../components/profile/CoursesTab.tsx";
import { UserAvatar } from "../components/shared/UserAvatar.tsx";
import { RoleTag } from "../components/shared/RoleTag.tsx";
import { routes } from "../constants/routes.ts";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";
import { useGetUserByIdQuery } from "../api/auth.api.ts";

const { Title, Text } = Typography;

/**
 * /profile          → the logged-in user's own profile
 * /profile/:userId  → any user's profile (admins only, loaded from /admin/users/{id})
 */
export function UserProfilePage() {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useCurrentUser();

  const isOtherUser = Boolean(userId) && userId !== currentUser?.id;
  const otherUserQuery = useGetUserByIdQuery(userId ?? "", {
    skip: !isOtherUser,
  });
  const user = isOtherUser ? otherUserQuery.data : currentUser;

  if (isOtherUser && otherUserQuery.isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (!user) {
    return <Result status="404" title={formatMessage({ id: "not-found-subtitle" })} />;
  }

  return (
    <div>
      <div style={{ padding: 20 }}>
        <Flex style={{ width: "100%" }} justify="space-between" align="start">
          <Flex align={"center"} gap={24} wrap={"wrap"}>
            <UserAvatar user={user} size={100} />
            <Space direction="vertical">
              <Space wrap>
                <Title level={3} style={{ margin: 0 }}>
                  {user.firstName} {user.lastName}
                </Title>
                <RoleTag role={user.role} />
                {user.status === "suspended" && (
                  <Tag color="red">{formatMessage({ id: "suspended" })}</Tag>
                )}
              </Space>
              <ParagraphInfo icon={<MailOutlined />} text={user.email} />
              <ParagraphInfo
                icon={<GlobalOutlined />}
                text={user.country?.name ?? formatMessage({ id: "not-set" })}
              />
            </Space>
          </Flex>
          {!isOtherUser && (
            <Space>
              {/* Not connected yet: the change-password form will be added later */}
              <Button icon={<LockOutlined />}>
                {formatMessage({ id: "change-password-button" })}
              </Button>
              <Button
                onClick={() => navigate(routes.settings)}
                iconPosition="end"
                icon={<EditOutlined />}
              />
            </Space>
          )}
        </Flex>
        <Divider />

        <Text type={"secondary"} style={{ fontSize: 16, marginRight: 10 }}>
          {formatMessage({ id: "bio" })}:
        </Text>
        {user.bio ? (
          <Text style={{ fontSize: 16 }}>{user.bio}</Text>
        ) : (
          <Text type="secondary" italic style={{ fontSize: 16 }}>
            {formatMessage({ id: "no-bio" })}
          </Text>
        )}
      </div>

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
            ...(user.role === "user"
              ? [
                  {
                    key: "courses",
                    label: formatMessage({ id: "passed-courses" }),
                    children: <CoursesTab isOwnProfile={!isOtherUser} />,
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}
