import type { ReactNode } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  List,
  Row,
  Statistic,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  FlagOutlined,
  StopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { UserAvatar } from "../../components/shared/UserAvatar.tsx";
import { RoleTag } from "../../components/shared/RoleTag.tsx";
import { routes } from "../../constants/routes.ts";
import { useGetApplicationsQuery, useGetUsersQuery } from "../../api/auth.api.ts";
import { useGetAuditLogQuery } from "../../api/audit.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type { IAuditActor } from "../../constants/interfaces/audit.interfaces.ts";

const { Text } = Typography;

const LIST_SIZE = 5;
const ACTIVITY_SIZE = 6;

interface StatTileProps {
  title: string;
  value?: number;
  icon: ReactNode;
  loading?: boolean;
  /** Highlight the number (something needs the admin's attention). */
  highlight?: boolean;
  footer?: ReactNode;
  onClick?: () => void;
  /** Not available yet: shows "Coming soon" instead of a number. */
  comingSoon?: boolean;
}

function StatTile({
  title,
  value,
  icon,
  loading,
  highlight,
  footer,
  onClick,
  comingSoon,
}: StatTileProps) {
  const { token } = theme.useToken();
  const { formatMessage } = useIntl();

  return (
    <Card
      hoverable={Boolean(onClick)}
      onClick={onClick}
      style={{ height: "100%", borderRadius: 16, boxShadow: token.boxShadowTertiary }}
    >
      <Flex justify="space-between" align="start" gap={12}>
        {comingSoon ? (
          <Flex vertical gap={8}>
            <Text type="secondary">{title}</Text>
            <Tag style={{ width: "fit-content" }}>
              {formatMessage({ id: "coming-soon" })}
            </Tag>
          </Flex>
        ) : (
          <Statistic
            title={title}
            value={value ?? 0}
            loading={loading}
            valueStyle={highlight ? { color: token.colorWarning } : undefined}
          />
        )}
        <span style={{ fontSize: 24, color: token.colorTextTertiary }}>{icon}</span>
      </Flex>
      {footer && <div style={{ marginTop: 8 }}>{footer}</div>}
    </Card>
  );
}

/** Card for a feature whose backend is not available yet. */
function ComingSoonCard({ title, text }: { title: string; text: string }) {
  const { token } = theme.useToken();
  const { formatMessage } = useIntl();

  return (
    <Card
      title={title}
      extra={<Tag>{formatMessage({ id: "coming-soon" })}</Tag>}
      style={{ height: "100%", borderRadius: 16, boxShadow: token.boxShadowTertiary }}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text} />
    </Card>
  );
}

/**
 * Admin dashboard: an overview of what needs attention, with shortcuts to the full pages.
 * Reports, categories and platform statistics are placeholders until their services exist.
 */
export function AdminDashboard() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Counts come from the totals of the existing list endpoints
  const newUsers = useGetUsersQuery({ page: 0, size: LIST_SIZE });
  const students = useGetUsersQuery({ role: "user", page: 0, size: 1 });
  const teachers = useGetUsersQuery({ role: "teacher", page: 0, size: 1 });
  const admins = useGetUsersQuery({ role: "admin", page: 0, size: 1 });
  const suspended = useGetUsersQuery({ status: "suspended", page: 0, size: 1 });
  const pending = useGetApplicationsQuery({
    status: "pending",
    page: 0,
    size: LIST_SIZE,
  });
  const activity = useGetAuditLogQuery({ page: 0, size: ACTIVITY_SIZE });

  const pendingCount = pending.data?.totalElements ?? 0;

  /** Translated label if one exists, otherwise the raw value (same as the Audit Log page). */
  const actionLabel = (value: string) =>
    intl.messages[`audit-action.${value}`]
      ? formatMessage({ id: `audit-action.${value}` })
      : value;

  const actorName = (actor: IAuditActor | null) => {
    if (!actor) return formatMessage({ id: "system" });
    const name = `${actor.firstName ?? ""} ${actor.lastName ?? ""}`.trim();
    return name || formatMessage({ id: "unknown-user" });
  };

  const cardStyle = { height: "100%", borderRadius: 16, boxShadow: token.boxShadowTertiary };
  const viewAll = (route: string) => (
    <Button type="link" style={{ padding: 0 }} onClick={() => navigate(route)}>
      {formatMessage({ id: "view-all" })}
    </Button>
  );

  return (
    <div>
      <PageTitle>{formatMessage({ id: "dashboard" })}</PageTitle>

      <Flex vertical gap={16} style={{ marginTop: 16 }}>
        {/* Numbers that need attention */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "pending-applications" })}
              value={pendingCount}
              loading={pending.isLoading}
              highlight={pendingCount > 0}
              icon={<ClockCircleOutlined />}
              onClick={() => navigate(routes.teacherApplication)}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "total-users" })}
              value={newUsers.data?.totalElements}
              loading={newUsers.isLoading}
              icon={<TeamOutlined />}
              onClick={() => navigate(routes.users)}
              footer={
                <Text type="secondary">
                  {formatMessage({ id: "students" })}: {students.data?.totalElements ?? 0}
                  {" · "}
                  {formatMessage({ id: "teachers" })}: {teachers.data?.totalElements ?? 0}
                  {" · "}
                  {formatMessage({ id: "admins" })}: {admins.data?.totalElements ?? 0}
                </Text>
              }
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "suspended-users" })}
              value={suspended.data?.totalElements}
              loading={suspended.isLoading}
              icon={<StopOutlined />}
              onClick={() => navigate(`${routes.users}?status=suspended`)}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            {/* Not available yet: content reports come with the Enrollment & Platform service */}
            <StatTile
              comingSoon
              title={formatMessage({ id: "reports-to-review" })}
              icon={<FlagOutlined />}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Applications waiting for review */}
          <Col xs={24} lg={12}>
            <Card
              title={formatMessage({ id: "applications-waiting" })}
              extra={viewAll(routes.teacherApplication)}
              loading={pending.isLoading}
              style={cardStyle}
            >
              <List
                dataSource={pending.data?.content ?? []}
                locale={{ emptyText: formatMessage({ id: "no-pending-applications" }) }}
                renderItem={(application) => (
                  <List.Item
                    actions={[
                      <Button
                        key="review"
                        size="small"
                        onClick={() => navigate(routes.teacherApplication)}
                      >
                        {formatMessage({ id: "review" })}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={`${application.applicant.firstName} ${application.applicant.lastName}`}
                      description={
                        <Text type="secondary" ellipsis={{ tooltip: application.applicant.email }}>
                          {application.applicant.email}
                        </Text>
                      }
                    />
                    <Text type="secondary">{getDMY(application.createdAt)}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Not available yet */}
          <Col xs={24} lg={12}>
            <ComingSoonCard
              title={formatMessage({ id: "reports-to-review" })}
              text={formatMessage({ id: "reports-coming-soon" })}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Latest audit log entries */}
          <Col xs={24} lg={12}>
            <Card
              title={formatMessage({ id: "recent-activity" })}
              extra={viewAll(routes.auditLog)}
              loading={activity.isLoading}
              style={cardStyle}
            >
              <List
                dataSource={activity.data?.content ?? []}
                locale={{ emptyText: formatMessage({ id: "no-activity" }) }}
                renderItem={(entry) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Flex gap={8} align="center" wrap>
                          <Tag color="blue" style={{ margin: 0 }}>
                            {actionLabel(entry.action)}
                          </Tag>
                          {entry.entityName && <Text>{entry.entityName}</Text>}
                        </Flex>
                      }
                      description={`${actorName(entry.actor)} · ${dayjs(entry.createdAt).format("DD/MM/YYYY HH:mm")}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Newest sign-ups (the users list is newest first) */}
          <Col xs={24} lg={12}>
            <Card
              title={formatMessage({ id: "new-users" })}
              extra={viewAll(routes.users)}
              loading={newUsers.isLoading}
              style={cardStyle}
            >
              <List
                dataSource={newUsers.data?.content ?? []}
                locale={{ emptyText: formatMessage({ id: "no-users" }) }}
                renderItem={(user) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(routes.profileView(user.id))}
                  >
                    <List.Item.Meta
                      avatar={<UserAvatar user={user} />}
                      title={`${user.firstName} ${user.lastName}`}
                      description={
                        <Text type="secondary" ellipsis={{ tooltip: user.email }}>
                          {user.email}
                        </Text>
                      }
                    />
                    <Flex vertical align="end" gap={4}>
                      <RoleTag role={user.role} />
                      <Text type="secondary">{getDMY(user.createdAt)}</Text>
                    </Flex>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Not available yet: come with the Course and Enrollment & Platform services */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <ComingSoonCard
              title={formatMessage({ id: "categories-to-approve" })}
              text={formatMessage({ id: "categories-coming-soon" })}
            />
          </Col>
          <Col xs={24} lg={12}>
            <ComingSoonCard
              title={formatMessage({ id: "platform-statistics" })}
              text={formatMessage({ id: "platform-stats-coming-soon" })}
            />
          </Col>
        </Row>
      </Flex>
    </div>
  );
}
