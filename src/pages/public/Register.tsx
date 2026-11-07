import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { GlobalOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch.ts";
import { routes } from "../../constants/routes.ts";
import { Logo } from "../../components/shared/Logo.tsx";
import {
  selectLocale,
  selectThemeMode,
  setAccessToken,
} from "../../store/slices/config.slice.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import {
  authApi,
  useGetCountriesQuery,
  useRegisterMutation,
  useUpdateMeMutation,
} from "../../api/auth.api.ts";
import { applyFieldErrors } from "../../api/index.api.ts";
import { PASSWORD_PATTERN } from "../../constants/global.constants.ts";

const { Text } = Typography;

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryId: string;
}

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterFormValues>();
  const { formatMessage } = useIntl();
  const locale = useAppSelector(selectLocale);
  const themeMode = useAppSelector(selectThemeMode);

  const { data: countries = [], isLoading: countriesLoading } =
    useGetCountriesQuery();
  const [register, { isLoading }] = useRegisterMutation();
  const [updateMe] = useUpdateMeMutation();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        countryId: values.countryId,
        // Keep the language the user chose on this page
        preferredLanguage: locale,
      }).unwrap();

      dispatch(setAccessToken(response.accessToken));
      let user = response.user;
      // New accounts start with the light theme; keep the theme chosen on this page
      if (user.preferredTheme !== themeMode) {
        user = await updateMe({ preferredTheme: themeMode }).unwrap();
      }
      dispatch(authApi.util.upsertQueryData("getMe", undefined, user));
      navigate(routes.dashboard);
    } catch (error) {
      // The error message is shown as a toast by the base query
      applyFieldErrors(form, error);
    }
  };

  const nameRules = (requiredMessageId: string, defaultMessage: string) => [
    {
      required: true,
      whitespace: true,
      message: formatMessage({ id: requiredMessageId, defaultMessage }),
    },
    {
      max: 100,
      message: formatMessage({
        id: "name-too-long",
        defaultMessage: "At most 100 characters",
      }),
    },
  ];

  return (
    <Card style={{ borderRadius: 12 }}>
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
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="firstName"
              label={formatMessage({
                id: "first-name",
                defaultMessage: "First Name",
              })}
              rules={nameRules(
                "first-name-required",
                "Please enter your first name",
              )}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={formatMessage({
                  id: "enter-your-first-name",
                  defaultMessage: "Enter your first name",
                })}
                autoComplete="given-name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="lastName"
              label={formatMessage({
                id: "last-name",
                defaultMessage: "Last Name",
              })}
              rules={nameRules(
                "last-name-required",
                "Please enter your last name",
              )}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={formatMessage({
                  id: "enter-your-last-name",
                  defaultMessage: "Enter your last name",
                })}
                autoComplete="family-name"
              />
            </Form.Item>
          </Col>
        </Row>

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
            prefix={<MailOutlined />}
            placeholder={formatMessage({
              id: "enter-your-email",
              defaultMessage: "Enter your email",
            })}
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={formatMessage({ id: "password", defaultMessage: "Password" })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "password-required",
                defaultMessage: "Please enter your password",
              }),
            },
            {
              pattern: PASSWORD_PATTERN,
              message: formatMessage({
                id: "password-rules",
                defaultMessage:
                  "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, a special character, and no character repeated 3 times in a row.",
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
            autoComplete="new-password"
          />
        </Form.Item>

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
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="countryId"
          label={formatMessage({ id: "country", defaultMessage: "Country" })}
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "country-required",
                defaultMessage: "Please select a country",
              }),
            },
          ]}
        >
          <Select
            showSearch
            loading={countriesLoading}
            suffixIcon={<GlobalOutlined />}
            placeholder={formatMessage({
              id: "select-country",
              defaultMessage: "Select your country",
            })}
            optionFilterProp="label"
            options={countries.map((country) => ({
              value: country.id,
              label: country.name,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
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
  );
}
