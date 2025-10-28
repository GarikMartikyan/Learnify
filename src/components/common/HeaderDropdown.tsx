import { Dropdown, type MenuProps, Space, Typography } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { routes } from "../../constants/routes.ts";
import { useNavigate } from "react-router";
import { user } from "../../utils/index.utils.ts";
import { UserAvatar } from "../shared/UserAvatar.tsx";
import { useIntl } from "react-intl";

export function HeaderDropdown() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: routes.profile,
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: routes.settings,
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      key: routes.applyToTeacher,
      label: formatMessage({ id: "apply-to-teacher" }),
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <a
        onClick={(e) => e.preventDefault()}
        style={{ display: "inline-block", cursor: "pointer" }}
      >
        <Space split={undefined} size="small" align="center">
          <UserAvatar />
          {user.name ? (
            <Typography.Text strong style={{ marginLeft: 4 }}>
              {user.name}
            </Typography.Text>
          ) : null}
        </Space>
      </a>
    </Dropdown>
  );
}
