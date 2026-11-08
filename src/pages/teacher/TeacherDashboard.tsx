import { Avatar, Button, Card, Col, Flex, List, Row, Typography } from "antd";
import {
  BookOutlined,
  FileDoneOutlined,
  PictureOutlined,
  PlusOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useGetMyCoursesQuery } from "../../api/course.api.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { CourseStatusTag } from "../../components/courses/CourseTags.tsx";
import { ComingSoonCard, StatTile } from "../../components/shared/DashboardCards.tsx";
import { useDashboardCardStyle } from "../../hooks/useDashboardCardStyle.ts";
import { getDMY } from "../../utils/date.ustils.ts";

const { Text } = Typography;

const RECENT_COUNT = 5;

/**
 * Teacher dashboard: numbers about the teacher's own courses and the recently edited ones.
 * Student numbers and course statistics are placeholders until the Enrollment service provides them.
 */
export function TeacherDashboard() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const cardStyle = useDashboardCardStyle();
  const { data: courses = [], isLoading } = useGetMyCoursesQuery();

  const publishedCount = courses.filter((c) => c.status === "published").length;
  const draftCount = courses.filter((c) => c.status === "draft").length;
  const chapterCount = courses.reduce((sum, c) => sum + c.chapterCount, 0);
  const examCount = courses.reduce((sum, c) => sum + c.examCount, 0);
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, RECENT_COUNT);

  return (
    <div>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "dashboard" })}</PageTitle>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => navigate(routes.createCourse)}
        >
          {formatMessage({ id: "create-course" })}
        </Button>
      </Flex>

      <Flex vertical gap={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "courses-created" })}
              value={courses.length}
              loading={isLoading}
              icon={<ReadOutlined />}
              onClick={() => navigate(routes.myCourses)}
              footer={
                <Text type="secondary">
                  {formatMessage({ id: "course-status-published" })}: {publishedCount}
                  {" · "}
                  {formatMessage({ id: "course-status-draft" })}: {draftCount}
                </Text>
              }
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "chapters-created" })}
              value={chapterCount}
              loading={isLoading}
              icon={<BookOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatTile
              title={formatMessage({ id: "exams-created" })}
              value={examCount}
              loading={isLoading}
              icon={<FileDoneOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            {/* Not available yet: needs enrollment counts per teacher */}
            <StatTile
              comingSoon
              title={formatMessage({ id: "students-enrolled" })}
              icon={<TeamOutlined />}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={formatMessage({ id: "recently-updated-courses" })}
              extra={
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => navigate(routes.myCourses)}
                >
                  {formatMessage({ id: "view-all" })}
                </Button>
              }
              loading={isLoading}
              style={cardStyle}
            >
              <List
                dataSource={recentCourses}
                locale={{ emptyText: formatMessage({ id: "no-own-courses" }) }}
                renderItem={(course) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(routes.myCourseById(course.id))}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={40}
                          src={course.coverImageUrl ?? undefined}
                          icon={<PictureOutlined />}
                        />
                      }
                      title={
                        <Text strong ellipsis={{ tooltip: course.name }}>
                          {course.name}
                        </Text>
                      }
                      description={getDMY(course.updatedAt)}
                    />
                    <CourseStatusTag status={course.status} disabled={course.disabled} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Not available yet: pass rates come with the Enrollment & Grading service */}
          <Col xs={24} lg={12}>
            <ComingSoonCard
              title={formatMessage({ id: "course-passing-percentage" })}
              text={formatMessage({ id: "course-stats-coming-soon" })}
            />
          </Col>
        </Row>
      </Flex>
    </div>
  );
}
