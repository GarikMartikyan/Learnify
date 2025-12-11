import { useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Progress,
  Space,
  Table,
  Typography,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";

import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const { Title } = Typography;

export function CourseStatistics() {
  const [viewCourse, setViewCourse] = useState<any | null>(null);

  const [courses] = useState([
    {
      id: 1,
      name: "JavaScript Fundamentals",
      participants: 120,
      passed: 87,
      rating: 4.6,
      status: "Active",
      monthlyProgress: [
        { month: "Jan", passed: 30 },
        { month: "Feb", passed: 50 },
        { month: "Mar", passed: 87 },
      ],
    },
    {
      id: 2,
      name: "Advanced TypeScript",
      participants: 98,
      passed: 64,
      rating: 4.4,
      status: "Active",
      monthlyProgress: [
        { month: "Jan", passed: 20 },
        { month: "Feb", passed: 40 },
        { month: "Mar", passed: 64 },
      ],
    },
    {
      id: 3,
      name: "Node.js Backend Basics",
      participants: 72,
      passed: 33,
      rating: 4.1,
      status: "Draft",
      monthlyProgress: [
        { month: "Jan", passed: 10 },
        { month: "Feb", passed: 20 },
        { month: "Mar", passed: 33 },
      ],
    },
  ]);

  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
      align: "center",
    },
    {
      title: "Passed",
      dataIndex: "passed",
      key: "passed",
      align: "center",
    },
    {
      title: "Completion Rate",
      key: "completion",
      align: "center",
      render: (_: any, record: any) => {
        const rate = Math.round((record.passed / record.participants) * 100);
        return (
          <Progress
            percent={rate}
            size="small"
            status={rate >= 70 ? "success" : "normal"}
            style={{ width: 100 }}
          />
        );
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      render: (rate: number) => `${rate.toFixed(1)} ★`,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setViewCourse(record)}>
            View
          </Button>
          <Link to={routes.myCourseById(String(record.id))}>
            <Button type="default">Open Page</Button>
          </Link>
        </Space>
      ),
    },
  ];

  const pieData = (course: any) => [
    { name: "Passed", value: course.passed },
    { name: "Not Passed", value: course.participants - course.passed },
  ];

  const COLORS = ["#4caf50", "#d9d9d9"];

  return (
    <div style={{ padding: 24 }}>
      <Card bordered style={{ borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Course Statistics
        </Title>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* ===================== MODAL ===================== */}
      <Modal
        open={!!viewCourse}
        title={viewCourse?.name}
        width={800}
        onCancel={() => setViewCourse(null)}
        footer={[
          <Button key="close" onClick={() => setViewCourse(null)}>
            Close
          </Button>,
        ]}
      >
        {viewCourse && (
          <div style={{ marginTop: 16 }}>
            {/* --- Summary Block --- */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 10,
                background: "#fafafa",
              }}
            >
              <Descriptions column={2} title="General Info">
                <Descriptions.Item label="Failed">33</Descriptions.Item>
                <Descriptions.Item label="Participants">
                  {viewCourse.participants}
                </Descriptions.Item>
                <Descriptions.Item label="Passed">
                  {viewCourse.passed}
                </Descriptions.Item>
                <Descriptions.Item label="Rating">
                  ⭐ {viewCourse.rating}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* --- Charts Layout --- */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {/* LINE CHART */}
              <Card style={{ borderRadius: 10 }} title="Monthly Passed">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={viewCourse.monthlyProgress}>
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="passed"
                      stroke="#1677ff"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* PIE CHART */}
              <Card style={{ borderRadius: 10 }} title="Completion Breakdown">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData(viewCourse)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {pieData(viewCourse).map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
