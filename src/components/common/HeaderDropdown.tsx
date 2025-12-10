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
import {
  removeAccessToken,
  selectAccessToken,
} from "../../store/slices/config.slice.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { userRole } from "../../utils/index.utils.ts";

export function HeaderDropdown() {
  const accessToken = useAppSelector(selectAccessToken);

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
    {
      key: routes.applyToTeacher,
      label: formatMessage({ id: "apply-to-teacher" }),
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: routes.login,
      label: formatMessage({ id: "logout" }),
      icon: <LogoutOutlined />,
    },
  ];

  const filteredMenuItems =
    userRole === "student"
      ? items
      : items?.filter((items) => items?.key !== routes.applyToTeacher);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === routes.login) {
      dispatch(removeAccessToken());
    }
    navigate(key);
  };

  return accessToken ? (
    <Dropdown
      menu={{ items: filteredMenuItems, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Space split={undefined} size="small" align="center">
        <UserAvatar />
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
