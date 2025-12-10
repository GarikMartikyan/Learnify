import { useState } from "react";
import {
  Button,
  Card,
  Image,
  message,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TeacherApplication {
  id: number;
  username: string;
  message: string;
  certificateImage: string;
}

// Mock Data
const applications: TeacherApplication[] = [
  {
    id: 1,
    username: "Alice Smith",
    message:
      "I have been teaching coding for 5 years and would like to apply as a teacher on your platform...",
    certificateImage:
      "https://img.freepik.com/free-vector/realistic-certificate-template_52683-83834.jpg?semt=ais_se_enriched&w=740&q=80",
  },
  {
    id: 2,
    username: "Bob Johnson",
    message:
      "I have a degree in computer science and experience with online teaching. I am applying as a teacher...",
    certificateImage:
      "https://img.freepik.com/free-vector/realistic-certificate-template_52683-83834.jpg?semt=ais_se_enriched&w=740&q=80",
  },
  {
    id: 3,
    username: "Charlie Brown",
    message:
      "Looking forward to sharing my knowledge in JavaScript. Please consider my application...",
    certificateImage:
      "https://img.freepik.com/free-vector/realistic-certificate-template_52683-83834.jpg?semt=ais_se_enriched&w=740&q=80",
  },
];

export function TeacherApplicationsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<TeacherApplication | null>(null);

  const handleApprove = (id: number) => {
    message.success(`Approved user ID: ${id} as teacher`);
  };

  const handleDeny = (id: number) => {
    message.error(`Denied user ID: ${id}`);
  };

  const openModal = (record: TeacherApplication) => {
    setSelectedApplication(record);
    setModalVisible(true);
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) =>
        text.length > 50 ? text.slice(0, 50) + "..." : text,
    },
    {
      title: "Certificate",
      dataIndex: "certificateImage",
      key: "certificateImage",
      render: (url: string) => (
        <Image width={80} height={60} src={url} alt="certificate" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TeacherApplication) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleDeny(record.id)}
          >
            Deny
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "auto" }}>
      <Title level={2}>Teacher Applications</Title>

      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => openModal(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title={selectedApplication?.username}
        visible={modalVisible}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() =>
                selectedApplication && handleApprove(selectedApplication.id)
              }
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() =>
                selectedApplication && handleDeny(selectedApplication.id)
              }
            >
              Deny
            </Button>
            <Button onClick={() => setModalVisible(false)}>Close</Button>
          </Space>
        }
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Text strong>Application Message:</Text>
        <p>{selectedApplication?.message}</p>
        <Text strong>Certificate:</Text>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Image
            src={selectedApplication?.certificateImage}
            alt="certificate"
            width={400}
          />
        </div>
      </Modal>
    </div>
  );
}
