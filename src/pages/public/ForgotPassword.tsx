import { Button, Card, Form, Input, theme, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import { routes } from "../../constants/routes.ts";
import { Logo } from "../../components/shared/Logo.tsx";

const { Text } = Typography;

interface ForgotPasswordPageProps {
  onSubmit?: (values: { email: string }) => void;
}

export function ForgotPassword({ onSubmit }: ForgotPasswordPageProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const handleSubmit = (values: { email: string }) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
    }
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: token.boxShadowTertiary,
        paddingBlock: 40,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Logo />
      </div>

      <Form
        form={form}
        name="forgot-password-form"
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={formatMessage({ id: "email", defaultMessage: "Email" })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "email-required",
                defaultMessage: "Please enter your email",
              }),
            },
            {
              type: "email",
              message: formatMessage({
                id: "email-invalid",
                defaultMessage: "Enter a valid email address",
              }),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={formatMessage({
              id: "enter-your-email",
              defaultMessage: "Enter your email",
            })}
            aria-label="Email"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ borderRadius: 8 }}
          >
            {formatMessage({
              id: "reset-password",
              defaultMessage: "Reset Password",
            })}
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Text type="secondary">
            {formatMessage({
              id: "remember-your-password",
              defaultMessage: "Remember your password?",
            })}{" "}
            <Link to={routes.login}>
              {formatMessage({ id: "log-in", defaultMessage: "Log In" })}
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
}
