import {
  Button,
  Card,
  Divider,
  List,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  DollarOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { courseDetails } from "../placeholder/courses.ts";

const { Title, Text, Paragraph } = Typography;

export function CourseDetailsPage() {
  const { token } = theme.useToken();
  return (
    <div>
      <PageTitle showBackButton>{courseDetails.title}</PageTitle>
      <Card
        variant="borderless"
        style={{
          overflow: "hidden",
          width: "100%",
        }}
        cover={
          <img
            alt={courseDetails.title}
            src={courseDetails.image}
            style={{
              width: "100%",
              aspectRatio: "5/2",
              objectFit: "cover",
              borderRadius: token.borderRadiusLG,
            }}
          />
        }
      >
        <Tag color="blue">{courseDetails.category}</Tag>
        <Title level={2} style={{ marginTop: 8 }}>
          {courseDetails.title}
        </Title>
        <Text type="secondary">
          <UserOutlined /> {courseDetails.teacher} &nbsp; | &nbsp;
          <GlobalOutlined /> {courseDetails.language} &nbsp; | &nbsp;
          <CalendarOutlined /> Starts {courseDetails.startingDate}
        </Text>

        <Divider />

        <Paragraph style={{ fontSize: 16 }}>
          {courseDetails.description}
        </Paragraph>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <DollarOutlined /> ${courseDetails.price.toFixed(2)}
          </div>
          <Button type="primary" size="large">
            Join Course
          </Button>
        </div>
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
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: "Overview",
              children: (
                <Paragraph style={{ fontSize: 16, lineHeight: 1.7 }}>
                  In this course, you will learn the core concepts of
                  JavaScript, how to structure code efficiently, and how to
                  build dynamic front-end experiences. Each chapter includes
                  exercises, quizzes, and real-world examples.
                </Paragraph>
              ),
            },
            {
              key: "chapters",
              label: "Chapters",
              children: (
                <List
                  dataSource={courseDetails.chapters}
                  renderItem={(chapter) => (
                    <List.Item>
                      <BookOutlined style={{ marginRight: 8 }} />
                      {chapter.title}
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: "exams",
              label: "Exams",
              children: (
                <List
                  dataSource={courseDetails.exams}
                  renderItem={(exam) => (
                    <List.Item>
                      <BookOutlined style={{ marginRight: 8 }} />
                      {exam.title}
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
