import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import { routes } from "../constants/routes.ts";
import { Logo } from "../components/shared/Logo.tsx";
import { SelectRole } from "../components/shared/SelectRole.tsx";

const { Text } = Typography;
const { Option } = Select;

interface RegisterPageProps {
  onRegister?: (values: {
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor";
  }) => void;
}

export function Register({ onRegister }: RegisterPageProps) {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  const handleRegister = (values) => {
    if (onRegister) {
      onRegister(values);
    } else {
      console.log("Register data:", values);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ width: "100%" }}>
      <Col xs={24} sm={18} md={12} lg={9}>
        <Card
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Logo />
          </div>

          <Form
            form={form}
            name="register-form"
            layout="vertical"
            onFinish={handleRegister}
            requiredMark={false}
          >
            {/* Full Name */}
            <Form.Item
              name="name"
              label={formatMessage({
                id: "full-name",
                defaultMessage: "Full Name",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "name-required",
                    defaultMessage: "Please enter your full name",
                  }),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={formatMessage({
                  id: "enter-your-name",
                  defaultMessage: "Enter your full name",
                })}
                aria-label="Full Name"
              />
            </Form.Item>

            {/* Email */}
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

            {/* Password */}
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
              hasFeedback
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

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label={formatMessage({
                id: "confirm-password",
                defaultMessage: "Confirm Password",
              })}
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "confirm-password-required",
                    defaultMessage: "Please confirm your password",
                  }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        formatMessage({
                          id: "passwords-dont-match",
                          defaultMessage: "Passwords do not match",
                        }),
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={formatMessage({
                  id: "re-enter-your-password",
                  defaultMessage: "Re-enter your password",
                })}
                aria-label="Confirm Password"
              />
            </Form.Item>

            {/* Role Select */}
            <Form.Item
              name="role"
              label={formatMessage({ id: "role", defaultMessage: "Role" })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "role-required",
                    defaultMessage: "Please select a role",
                  }),
                },
              ]}
            >
              <SelectRole
                placeholder={formatMessage({
                  id: "select-role",
                  defaultMessage: "Select Role",
                })}
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ borderRadius: 8 }}
              >
                {formatMessage({ id: "sign-up", defaultMessage: "Sign Up" })}
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Text type="secondary">
                {formatMessage({
                  id: "already-have-an-account",
                  defaultMessage: "Already have an account?",
                })}{" "}
                <Link to={routes.login}>
                  {formatMessage({ id: "log-in", defaultMessage: "Log In" })}
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
