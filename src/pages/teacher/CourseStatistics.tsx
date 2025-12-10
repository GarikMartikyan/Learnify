import { useState } from "react";
import { Button, Card, Progress, Space, Table, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";

const { Title } = Typography;

export function CourseStatistics() {
  const [courses] = useState([
    {
      id: 1,
      name: "JavaScript Fundamentals",
      participants: 120,
      passed: 87,
      rating: 4.6,
      status: "Active",
    },
    {
      id: 2,
      name: "Advanced TypeScript",
      participants: 98,
      passed: 64,
      rating: 4.4,
      status: "Active",
    },
    {
      id: 3,
      name: "Node.js Backend Basics",
      participants: 72,
      passed: 33,
      rating: 4.1,
      status: "Draft",
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
      render: () => (
        <Space>
          <Link to={routes.myCourseById("12")}>
            <Button icon={<EyeOutlined />}>View</Button>
          </Link>
        </Space>
      ),
    },
  ];

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
    </div>
  );
}
