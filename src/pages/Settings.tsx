import { useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Select,
  Typography,
  Upload,
} from "antd";
import {
  EditOutlined,
  GlobalOutlined,
  MailOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { user as defaultUser, userRole } from "../utils/index.utils.ts";
import { useIntl } from "react-intl";

const { Title, Text } = Typography;

export function Settings() {
  const [user, setUser] = useState(defaultUser);
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const handleSave = (values: any) => {
    setUser({ ...user, ...values });
    message.success(formatMessage({ id: "profile-updated" }));
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
      message.success(formatMessage({ id: "avatar-updated" }));
      setUser({
        ...user,
        avatarUrl:
          "https://api.dicebear.com/8.x/avataaars/svg?seed=UpdatedAvatar" +
          Math.random(),
      });
    }
  };

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Avatar size={96} src={user.avatarUrl} icon={<UserOutlined />} />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {user.name}
          </Title>
          <Text type="secondary">{userRole}</Text>
          <Divider type="vertical" />
          <Text type="secondary">{user.country}</Text>
        </div>
      </div>

      <Divider />

      <Title level={4}>{formatMessage({ id: "edit-profile" })}</Title>

      <Form
        labelCol={{ md: 7, lg: 4 }}
        labelAlign="left"
        form={form}
        layout="horizontal"
        initialValues={user}
        onFinish={handleSave}
        style={{ marginTop: 16 }}
      >
        <Form.Item label={formatMessage({ id: "full-name" })} name="name">
          <Input
            prefix={<UserOutlined />}
            placeholder={formatMessage({ id: "full-name-placeholder" })}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "email" })} name="email">
          <Input
            prefix={<MailOutlined />}
            placeholder={formatMessage({ id: "email-placeholder" })}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "country" })} name="country">
          <Input
            prefix={<GlobalOutlined />}
            placeholder={formatMessage({ id: "country-placeholder" })}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "language" })} name="language">
          <Select
            options={[
              { value: "English", label: formatMessage({ id: "english" }) },
              { value: "Spanish", label: formatMessage({ id: "spanish" }) },
              { value: "French", label: formatMessage({ id: "french" }) },
            ]}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "bio" })} name="bio">
          <Input.TextArea
            rows={3}
            placeholder={formatMessage({ id: "bio-placeholder" })}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Divider />

        <Title level={4}>{formatMessage({ id: "profile-picture" })}</Title>
        <Upload
          name="avatar"
          showUploadList={false}
          customRequest={({ onSuccess }) => {
            setTimeout(() => onSuccess && onSuccess("ok"), 1000);
          }}
          onChange={handleAvatarChange}
        >
          <Button icon={<UploadOutlined />}>
            {formatMessage({ id: "change-avatar" })}
          </Button>
        </Upload>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Button icon={<EditOutlined />}>
            {formatMessage({ id: "cancel" })}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ minWidth: 140 }}
          >
            {formatMessage({ id: "save-changes" })}
          </Button>
        </div>
      </Form>
    </div>
  );
}
