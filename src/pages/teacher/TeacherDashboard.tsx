"use client";

import { Card, Col, List, Progress, Row, Space, Typography } from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";

const { Title, Text } = Typography;

export function TeacherDashboard() {
  const { formatMessage } = useIntl();

  const stats = {
    courses: 7,
    exams: 14,
    students: 126,
  };

  const recentCourses = [
    { id: 1, title: "Introduction to JavaScript", progress: 85 },
    { id: 2, title: "Advanced TypeScript", progress: 60 },
    { id: 3, title: "Data Structures & Algorithms", progress: 40 },
  ];

  const recentExams = [
    { id: 1, title: "JS Midterm Exam", status: "Published" },
    { id: 2, title: "TS Final Exam", status: "Draft" },
    { id: 3, title: "Algorithms Quiz", status: "Published" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Row justify="space-between" style={{ marginBottom: 32 }}>
        <Title level={2}>{formatMessage({ id: "teacher-dashboard" })}</Title>
      </Row>

      {/* Stats Cards */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Space>
                <BookOutlined style={{ fontSize: 26 }} />
                <Title level={4}>{stats.courses}</Title>
              </Space>
              <Text type="secondary">
                {formatMessage({ id: "courses-created" })}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Space>
                <ExperimentOutlined style={{ fontSize: 26 }} />
                <Title level={4}>{stats.exams}</Title>
              </Space>
              <Text type="secondary">
                {formatMessage({ id: "exams-created" })}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Space>
                <CheckCircleOutlined style={{ fontSize: 26 }} />
                <Title level={4}>{stats.students}</Title>
              </Space>
              <Text type="secondary">
                {formatMessage({ id: "students-enrolled" })}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24}>
          <Card title={formatMessage({ id: "course-passing-percentage" })}>
            <List
              itemLayout="horizontal"
              dataSource={recentCourses}
              renderItem={(course) => (
                <List.Item>
                  <List.Item.Meta
                    title={course.title}
                    description={
                      <Progress percent={course.progress} size="small" />
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
