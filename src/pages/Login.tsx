import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import { routes } from "../constants/routes.ts";
import { Logo } from "../components/shared/Logo.tsx";

const { Text } = Typography;

interface LoginPageProps {
  onLogin?: (values: { email: string; password: string }) => void;
}

export function Login({ onLogin }: LoginPageProps) {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const handleLogin = (values: { email: string; password: string }) => {
    if (onLogin) {
      onLogin(values);
    } else {
      console.log("Login data:", values);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ width: "100%" }}>
      <Col xs={24} sm={18} md={12} lg={7}>
        <Card
          styles={{
            body: { paddingBlock: 40, backgroundColor: "transparent" },
          }}
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Logo />
          </div>

          <Form
            form={form}
            name="login-form"
            layout="vertical"
            onFinish={handleLogin}
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

            <Form.Item
              name="password"
              label={formatMessage({
                id: "password",
                defaultMessage: "Password",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "password-required",
                    defaultMessage: "Please enter your password",
                  }),
                },
                {
                  min: 6,
                  message: formatMessage({
                    id: "password-min-length",
                    defaultMessage: "Password must be at least 6 characters",
                  }),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={formatMessage({
                  id: "enter-your-password",
                  defaultMessage: "Enter your password",
                })}
                aria-label="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ borderRadius: 8 }}
              >
                {formatMessage({ id: "log-in", defaultMessage: "Log In" })}
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Text type="secondary">
                {formatMessage({
                  id: "dont-have-an-account",
                  defaultMessage: "Don’t have an account?",
                })}{" "}
                <Link to={routes.register}>
                  {formatMessage({ id: "sign-up", defaultMessage: "Sign Up" })}
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
