import { Card, Col, Divider, List, Progress, Row, Typography } from "antd";

import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useIntl } from "react-intl";
import {
  mockRecentCourses,
  mockUpcomingChapters,
  mockUpcomingExams,
} from "../../placeholder/dashboard.ts";

const { Title, Text } = Typography;

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const handleChapterClick = (chapterId) => {
    navigate(routes.chapterById(chapterId));
  };
  const handleCourseClick = (courseId) => {
    navigate(routes.myCourseById(courseId));
  };
  const handleExamClick = (examId) => {
    navigate(routes.examById(examId));
  };

  return (
    <div>
      <Title level={2}>{formatMessage({ id: "dashboard-title" })}</Title>

      <Card
        title={formatMessage({ id: "recently-enrolled-courses" })}
        style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <List
          grid={{ gutter: 24, column: 2 }}
          dataSource={mockRecentCourses}
          renderItem={(course) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => handleCourseClick(course?.id)}
            >
              <Card hoverable>
                <Title level={5}>{course.title}</Title>
                <Progress
                  percent={course.progress}
                  status={course.progress < 100 ? "active" : "success"}
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Row style={{ marginTop: 20 }} gutter={[24, 24]}>
        {/* Upcoming Exams */}
        <Col xs={24} md={24}>
          <Card
            title={formatMessage({ id: "upcoming-exams" })}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <List
              dataSource={mockUpcomingExams}
              renderItem={(exam) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleExamClick(exam?.id)}
                >
                  <div>
                    <Text strong>{exam.examTitle}</Text> <br />
                    <Text type="secondary">{exam.courseTitle}</Text> <br />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Upcoming Chapters */}
        <Col xs={24} md={24}>
          <Card
            title={formatMessage({ id: "upcoming-chapters" })}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <List
              dataSource={mockUpcomingChapters}
              renderItem={(chapter) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleChapterClick(chapter?.id)}
                >
                  <div>
                    <Text strong>{chapter.chapterTitle}</Text> <br />
                    <Text type="secondary">{chapter.courseTitle}</Text> <br />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Courses */}
    </div>
  );
}
