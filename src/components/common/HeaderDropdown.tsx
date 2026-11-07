import { Button, Dropdown, type MenuProps, Space, Typography } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { routes } from "../../constants/routes.ts";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { UserAvatar } from "../shared/UserAvatar.tsx";
import { useDispatch } from "react-redux";
import { removeAccessToken } from "../../store/slices/config.slice.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { authApi } from "../../api/auth.api.ts";
import { auditApi } from "../../api/audit.api.ts";

export function HeaderDropdown() {
  const { user, isLoggedIn } = useCurrentUser();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: routes.profile,
      label: formatMessage({ id: "profile" }),
      icon: <UserOutlined />,
    },
    {
      key: routes.settings,
      label: formatMessage({ id: "settings" }),
      icon: <SettingOutlined />,
    },
    // Only regular users can apply to become a teacher
    ...(user?.role === "user"
      ? [
          {
            key: routes.applyToTeacher,
            label: formatMessage({ id: "apply-to-teacher" }),
            icon: <UserOutlined />,
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: routes.login,
      label: formatMessage({ id: "logout" }),
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === routes.login) {
      dispatch(removeAccessToken());
      // Forget all data of the user who logged out
      dispatch(authApi.util.resetApiState());
      dispatch(auditApi.util.resetApiState());
    }
    navigate(key);
  };

  return isLoggedIn ? (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Space size="small" align="center" style={{ cursor: "pointer" }}>
        <UserAvatar />
        {user && (
          <Typography.Text strong style={{ whiteSpace: "nowrap" }}>
            {user.firstName} {user.lastName}
          </Typography.Text>
        )}
      </Space>
    </Dropdown>
  ) : (
    <Button type="text">
      <Typography.Text
        onClick={() => navigate(routes.login)}
        strong
        style={{ marginLeft: 4, whiteSpace: "nowrap" }}
      >
        {formatMessage({ id: "sign-in" })}
      </Typography.Text>
    </Button>
  );
}
