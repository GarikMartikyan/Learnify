import { useMemo, useState } from "react";
import {
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";

export function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      type: "student",
      status: "active",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      type: "teacher",
      status: "inactive",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      type: "student",
      status: "active",
    },
    {
      id: 4,
      name: "Diana Adams",
      email: "diana@example.com",
      type: "teacher",
      status: "active",
    },
    {
      id: 5,
      name: "Edward Miller",
      email: "edward@example.com",
      type: "student",
      status: "inactive",
    },
    {
      id: 6,
      name: "Fiona Davis",
      email: "fiona@example.com",
      type: "teacher",
      status: "active",
    },
  ]);

  // -----------------------
  // Search & Filters
  // -----------------------
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesType = userTypeFilter ? u.type === userTypeFilter : true;
      const matchesStatus = statusFilter ? u.status === statusFilter : true;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, search, userTypeFilter, statusFilter]);

  // -----------------------
  // Actions
  // -----------------------
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    message.success("User deleted");
  };

  const handleEdit = (id: number) => {
    message.info(`Edit user with id: ${id}`);
    // Redirect to edit page or open drawer modal
  };

  // -----------------------
  // Table Columns
  // -----------------------
  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Student", value: "student" },
        { text: "Teacher", value: "teacher" },
      ],
      onFilter: (value: any, record: any) => record.type === value,
      render: (type: string) => (
        <Tag color={type === "teacher" ? "blue" : "green"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, row: any) => (
        <Space>
          <Link to={routes.profileView("123")}>
            <Button type="default" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>

          <Popconfirm
            title="Are you sure delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // -----------------------
  // UI Rendering
  // -----------------------
  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22 }}>Users Management</h1>

      {/* Filters */}
      <Flex gap={12} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />

        <Select
          allowClear
          placeholder="Filter by type"
          style={{ width: 180 }}
          onChange={(v) => setUserTypeFilter(v)}
          options={[
            { value: "student", label: "Student" },
            { value: "teacher", label: "Teacher" },
          ]}
        />

        <Select
          allowClear
          placeholder="Filter by status"
          style={{ width: 180 }}
          onChange={(v) => setStatusFilter(v)}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </Flex>

      {/* Table */}
      <Table
        columns={userColumns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: false }}
      />
    </div>
  );
}
