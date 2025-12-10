import { Button, Card, Form, Input, theme, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { Logo } from "../../components/shared/Logo.tsx";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../store/slices/config.slice.ts";

const { Text } = Typography;

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const handleLogin = () => {
    navigate(routes.dashboard);
    dispatch(setAccessToken("accessToken"));
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
              min: 8,
              message: formatMessage({
                id: "password-min-length",
                defaultMessage: "Password must be at least 8 characters",
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
          <Link
            style={{ display: "block", textAlign: "center", marginTop: 10 }}
            to={routes.forgotPassword}
          >
            {formatMessage({
              id: "forgot-password",
              defaultMessage: "Forgot Password?",
            })}
          </Link>
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
  );
}
