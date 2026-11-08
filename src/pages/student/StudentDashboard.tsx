import { Button, Card, Col, Empty, List, Row, Spin, Tag, Typography } from "antd";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
import { EnrollmentCard } from "../../components/enrollment/EnrolledCourses.tsx";
import type { IEnrollment } from "../../constants/interfaces/enrollment.interfaces.ts";

const { Title, Text } = Typography;

/** How many courses the "Continue learning" section shows. */
const RECENT_COUNT = 4;

/** The student's dashboard: active courses with progress, and the next chapter / exam in each. */
export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { data: active = [], isLoading } = useGetMyEnrollmentsQuery("active");

  const upNext = active.filter((e) => e.nextItem && !e.courseDisabled);

  const openNext = (enrollment: IEnrollment) => {
    const next = enrollment.nextItem;
    if (next?.itemType === "chapter" && next.chapterId) {
      navigate(routes.learningChapter(enrollment.courseId, next.chapterId));
    } else {
      navigate(routes.learning(enrollment.courseId));
    }
  };

  return (
    <div>
      <Title level={2}>{formatMessage({ id: "dashboard-title" })}</Title>

      <Spin spinning={isLoading}>
        <Card
          title={formatMessage({ id: "continue-learning" })}
          extra={
            <Button type="link" onClick={() => navigate(routes.myCourses)}>
              {formatMessage({ id: "my-courses" })}
            </Button>
          }
          style={{ borderRadius: 16 }}
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
                <Col xs={24} md={12} xl={6} key={enrollment.id}>
                  <EnrollmentCard enrollment={enrollment} />
                </Col>
              ))}
            </Row>
          )}
        </Card>

        <Card
          title={formatMessage({ id: "up-next" })}
          style={{ marginTop: 20, borderRadius: 16 }}
        >
          <List
            dataSource={upNext}
            locale={{ emptyText: formatMessage({ id: "nothing-up-next" }) }}
            renderItem={(enrollment) => (
              <List.Item style={{ cursor: "pointer" }} onClick={() => openNext(enrollment)}>
                <List.Item.Meta
                  title={enrollment.nextItem!.title}
                  description={<Text type="secondary">{enrollment.courseName}</Text>}
                />
                <Tag color={enrollment.nextItem!.itemType === "chapter" ? "blue" : "orange"}>
                  {formatMessage({ id: enrollment.nextItem!.itemType })}
                </Tag>
              </List.Item>
            )}
          />
        </Card>
      </Spin>
    </div>
  );
}
