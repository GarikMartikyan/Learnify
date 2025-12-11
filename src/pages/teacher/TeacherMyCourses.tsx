import { useState } from "react";
import { Button, message, Popconfirm, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";

const { Title } = Typography;

export function TeacherMyCoursesPage() {
  const [courses, setCourses] = useState([
    { id: 1, name: "JavaScript Basics", users: 140, rating: 4.7 },
    { id: 2, name: "React Fundamentals", users: 95, rating: 4.5 },
    { id: 3, name: "Node.js for Beginners", users: 73, rating: 4.2 },
  ]);

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    message.success("Course deleted.");
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Users Enrolled",
      dataIndex: "users",
      key: "users",
      align: "center",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      render: (rating: number) => `${rating.toFixed(1)} ★`,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: any, record: any) => (
        <Space>
          <Link to={routes.myCourseById("123")}>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => console.log("Edit", record.id)}
            >
              Edit
            </Button>
          </Link>

          <Popconfirm
            title="Delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ borderRadius: 12 }}>
        {/* Header with button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            My Courses
          </Title>

          <Link to={routes.createCourse}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => console.log("Create new course")}
            >
              Create Course
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={courses}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
