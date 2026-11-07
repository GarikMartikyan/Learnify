import { useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  GlobalOutlined,
  MailOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";
import {
  useGetCountriesQuery,
  useRemoveAvatarMutation,
  useUpdateAvatarMutation,
  useUpdateMeMutation,
} from "../api/auth.api.ts";
import { applyFieldErrors } from "../api/index.api.ts";
import { setLocale, setThemeMode } from "../store/slices/config.slice.ts";
import { UserAvatar } from "../components/shared/UserAvatar.tsx";
import { RoleTag } from "../components/shared/RoleTag.tsx";
import { localeOptions } from "../constants/locales.ts";
import {
  MAX_AVATAR_SIZE_BYTES,
  MAX_BIO_LENGTH,
} from "../constants/global.constants.ts";
import type { IUser } from "../constants/interfaces/user.interfaces.ts";
import type { Locale, ThemeMode } from "../constants/types/index.types.ts";

const { Title, Text } = Typography;

interface SettingsFormValues {
  firstName: string;
  lastName: string;
  email: string;
  countryId?: string;
  preferredLanguage: Locale;
  preferredTheme: ThemeMode;
  bio?: string;
}

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

function toFormValues(user: IUser): SettingsFormValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    countryId: user.country?.id,
    preferredLanguage: user.preferredLanguage,
    preferredTheme: user.preferredTheme,
    bio: user.bio ?? "",
  };
}

export function Settings() {
  const { user } = useCurrentUser();
  const [form] = Form.useForm<SettingsFormValues>();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const { data: countries = [], isLoading: countriesLoading } =
    useGetCountriesQuery();
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();
  const [updateAvatar, { isLoading: isUploading }] = useUpdateAvatarMutation();
  const [removeAvatar, { isLoading: isRemoving }] = useRemoveAvatarMutation();

  // Fill the form once the user is loaded
  useEffect(() => {
    if (user) {
      form.setFieldsValue(toFormValues(user));
    }
  }, [user, form]);

  if (!user) {
    return null;
  }

  const handleSave = async (values: SettingsFormValues) => {
    try {
      const updated = await updateMe({
        firstName: values.firstName,
        lastName: values.lastName,
        countryId: values.countryId,
        preferredLanguage: values.preferredLanguage,
        preferredTheme: values.preferredTheme,
        bio: values.bio ?? "",
      }).unwrap();
      // Apply the saved language and theme right away
      dispatch(setLocale(updated.preferredLanguage));
      dispatch(setThemeMode(updated.preferredTheme));
      message.success(formatMessage({ id: "profile-updated" }));
    } catch (error) {
      applyFieldErrors(form, error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!AVATAR_TYPES.includes(file.type)) {
      message.error(formatMessage({ id: "avatar-rules" }));
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      message.error(formatMessage({ id: "avatar-too-large" }));
      return;
    }
    try {
      await updateAvatar(file).unwrap();
      message.success(formatMessage({ id: "avatar-updated" }));
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await removeAvatar().unwrap();
      message.success(formatMessage({ id: "avatar-removed" }));
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  return (
    <div style={{ borderRadius: 16, padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <UserAvatar size={96} />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {user.firstName} {user.lastName}
          </Title>
          <Space style={{ marginTop: 4 }}>
            <RoleTag role={user.role} />
            <Text type="secondary">
              {user.country?.name ?? formatMessage({ id: "not-set" })}
            </Text>
          </Space>
        </div>
      </div>

      <Divider />

      <Title level={4}>{formatMessage({ id: "profile-picture" })}</Title>
      <Space wrap>
        <Upload
          accept={AVATAR_TYPES.join(",")}
          showUploadList={false}
          beforeUpload={(file) => {
            handleAvatarUpload(file);
            // We upload ourselves, not through antd's built-in request
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} loading={isUploading}>
            {formatMessage({ id: "change-avatar" })}
          </Button>
        </Upload>
        {user.avatarUrl && (
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={isRemoving}
            onClick={handleAvatarRemove}
          >
            {formatMessage({ id: "remove-avatar" })}
          </Button>
        )}
        <Text type="secondary">{formatMessage({ id: "avatar-rules" })}</Text>
      </Space>

      <Divider />

      <Title level={4}>{formatMessage({ id: "edit-profile" })}</Title>

      <Form
        labelCol={{ md: 7, lg: 4 }}
        labelAlign="left"
        form={form}
        layout="horizontal"
        initialValues={toFormValues(user)}
        onFinish={handleSave}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label={formatMessage({ id: "first-name" })}
          name="firstName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: formatMessage({ id: "first-name-required" }),
            },
            { max: 100, message: formatMessage({ id: "name-too-long" }) },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: "last-name" })}
          name="lastName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: formatMessage({ id: "last-name-required" }),
            },
            { max: 100, message: formatMessage({ id: "name-too-long" }) },
          ]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: "email" })}
          name="email"
          extra={formatMessage({ id: "email-cannot-be-changed" })}
        >
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "country" })} name="countryId">
          <Select
            showSearch
            loading={countriesLoading}
            suffixIcon={<GlobalOutlined />}
            placeholder={formatMessage({ id: "select-country" })}
            optionFilterProp="label"
            options={countries.map((country) => ({
              value: country.id,
              label: country.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: "language" })}
          name="preferredLanguage"
        >
          <Select
            options={localeOptions.map(({ value, label }) => ({ value, label }))}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "theme" })} name="preferredTheme">
          <Select
            options={[
              { value: "light", label: formatMessage({ id: "light" }) },
              { value: "dark", label: formatMessage({ id: "dark" }) },
            ]}
          />
        </Form.Item>

        <Form.Item label={formatMessage({ id: "bio" })} name="bio">
          <Input.TextArea
            rows={3}
            placeholder={formatMessage({ id: "bio-placeholder" })}
            maxLength={MAX_BIO_LENGTH}
            showCount
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Button onClick={() => form.setFieldsValue(toFormValues(user))}>
            {formatMessage({ id: "cancel" })}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSaving}
            style={{ minWidth: 140 }}
          >
            {formatMessage({ id: "save-changes" })}
          </Button>
        </div>
      </Form>
    </div>
  );
}
