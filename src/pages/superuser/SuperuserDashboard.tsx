import { Button, Card, message, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  type: "student" | "teacher";
}

interface Course {
  id: number;
  title: string;
  author: string;
  rating: number;
}

// Mock Data
const users: User[] = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", type: "student" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", type: "teacher" },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    type: "student",
  },
];

const courses: Course[] = [
  { id: 1, title: "Intro to JavaScript", author: "Bob Johnson", rating: 4.5 },
  { id: 2, title: "React Basics", author: "Bob Johnson", rating: 4.7 },
];

export default function SuperUserDashboard() {
  const handleEditUser = (id: number) => {
    message.info(`Edit User ID: ${id}`);
  };

  const handleDeleteUser = (id: number) => {
    message.error(`Deleted User ID: ${id}`);
  };

  const handleEditCourse = (id: number) => {
    message.info(`Edit Course ID: ${id}`);
  };

  const handleDeleteCourse = (id: number) => {
    message.error(`Deleted Course ID: ${id}`);
  };

  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "User Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "teacher" ? "blue" : "green"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record.id)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const courseColumns = [
    { title: "Course Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r: number) => r.toFixed(1),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Course) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record.id)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCourse(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: "auto", padding: 24 }}>
      <Title level={2}>Super User Dashboard</Title>

      <Card
        title="Users"
        style={{
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card
        title="Courses"
        style={{ borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
      >
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
