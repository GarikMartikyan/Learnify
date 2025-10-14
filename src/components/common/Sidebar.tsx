import { Flex, Layout, Menu, type MenuProps, theme } from "antd";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { selectIsSidebarCollapsed } from "../../store/slices/layout.slice.ts";
import { Logo } from "../shared/Logo.tsx";
import { HEADER_HEIGHT } from "./Layout.tsx";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useIntl } from "react-intl";
import { userRole } from "../../utils/index.utils.ts";
import {
  PicRightOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export function Sidebar() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const handleMenuClick: MenuProps["onClick"] = (item) => {
    navigate(item?.key);
  };

  const menuItems: {
    student: MenuProps["items"];
    teacher: MenuProps["items"];
  } = {
    student: [
      {
        key: routes.dashboard,
        label: formatMessage({ id: "dashboard" }),
        icon: <PicRightOutlined />,
      },
      {
        key: routes.courses,
        label: formatMessage({ id: "courses" }),
        icon: <SnippetsOutlined />,
      },
      {
        key: routes.myCourses,
        label: formatMessage({ id: "my-courses" }),
        icon: <ScheduleOutlined />,
      },
      {
        key: routes.help,
        label: formatMessage({ id: "help" }),
        icon: <QuestionCircleOutlined />,
      },
    ],
    teacher: [],
  };

  return (
    <Sider
      style={{ background: colorBgContainer }}
      trigger={null}
      collapsible
      collapsed={isSidebarCollapsed}
    >
      <Flex
        justify={"center"}
        style={{ height: HEADER_HEIGHT, paddingInline: 12, paddingBlock: 8 }}
      >
        <Logo
          onClick={() => navigate(routes.dashboard)}
          variant={isSidebarCollapsed ? "image" : "full"}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Flex>
      <Menu
        onClick={handleMenuClick}
        style={{ background: colorBgContainer, borderRight: 0 }}
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems[userRole]}
      />
    </Sider>
  );
}
