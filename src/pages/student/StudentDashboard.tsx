import { Avatar, Button, Card, Col, Empty, Flex, List, Row, Tag, Typography, theme } from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  PlayCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
import { EnrollmentCard } from "../../components/enrollment/EnrolledCourses.tsx";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { StatTile } from "../../components/shared/DashboardCards.tsx";
import { useDashboardCardStyle } from "../../hooks/useDashboardCardStyle.ts";
import { useOpenNextItem } from "../../hooks/useOpenNextItem.ts";

const { Text } = Typography;

/** How many courses the "Continue learning" section shows. */
const RECENT_COUNT = 3;

/** The student's dashboard: progress numbers, active courses, and the next chapter / exam in each. */
export function StudentDashboardPage() {
  const navigate = useNavigate();
  const openNext = useOpenNextItem();
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const cardStyle = useDashboardCardStyle();
  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery();

  const active = enrollments.filter((e) => e.status === "active");
  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const averageProgress = active.length
    ? Math.round(active.reduce((sum, e) => sum + e.progressPercent, 0) / active.length)
    : 0;
  const upNext = active.filter((e) => e.nextItem && !e.courseDisabled);

  return (
    <div>
      <PageTitle>{formatMessage({ id: "dashboard" })}</PageTitle>

      <Flex vertical gap={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <StatTile
              title={formatMessage({ id: "enrollment-status-active" })}
              value={active.length}
              loading={isLoading}
              icon={<PlayCircleOutlined />}
              onClick={() => navigate(routes.myCourses)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatTile
              title={formatMessage({ id: "enrollment-status-completed" })}
              value={completedCount}
              loading={isLoading}
              icon={<CheckCircleOutlined />}
              onClick={() => navigate(routes.myCourses)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatTile
              title={formatMessage({ id: "average-progress" })}
              value={averageProgress}
              suffix="%"
              loading={isLoading}
              icon={<RiseOutlined />}
            />
          </Col>
        </Row>

        <Card
          title={formatMessage({ id: "continue-learning" })}
          extra={
            <Button type="link" style={{ padding: 0 }} onClick={() => navigate(routes.myCourses)}>
              {formatMessage({ id: "view-all" })}
            </Button>
          }
          loading={isLoading}
          style={cardStyle}
        >
          {active.length === 0 ? (
            <Empty description={formatMessage({ id: "no-active-enrollments" })}>
              <Button type="primary" onClick={() => navigate(routes.courses)}>
                {formatMessage({ id: "browse-courses" })}
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]} align="stretch">
              {active.slice(0, RECENT_COUNT).map((enrollment) => (
                <Col xs={24} md={12} xl={8} key={enrollment.id}>
                  <EnrollmentCard enrollment={enrollment} />
                </Col>
              ))}
            </Row>
          )}
        </Card>

        <Card title={formatMessage({ id: "up-next" })} loading={isLoading} style={cardStyle}>
          <List
            dataSource={upNext}
            locale={{ emptyText: formatMessage({ id: "nothing-up-next" }) }}
            renderItem={(enrollment) => {
              const next = enrollment.nextItem!;
              const isChapter = next.itemType === "chapter";
              return (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => openNext(enrollment)}
                  actions={[
                    <Button
                      key="open"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openNext(enrollment);
                      }}
                    >
                      {formatMessage({ id: "continue-course" })}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        icon={isChapter ? <BookOutlined /> : <FileDoneOutlined />}
                        style={{
                          background: isChapter ? token.colorPrimaryBg : token.colorWarningBg,
                          color: isChapter ? token.colorPrimary : token.colorWarning,
                        }}
                      />
                    }
                    title={next.title}
                    description={
                      <Text type="secondary" ellipsis={{ tooltip: enrollment.courseName }}>
                        {enrollment.courseName}
                      </Text>
                    }
                  />
                  <Tag color={isChapter ? "blue" : "orange"} style={{ margin: 0 }}>
                    {formatMessage({ id: next.itemType })}
                  </Tag>
                </List.Item>
              );
            }}
          />
        </Card>
      </Flex>
    </div>
  );
}
