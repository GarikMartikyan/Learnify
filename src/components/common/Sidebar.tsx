import { Flex, Layout, Menu, type MenuProps, theme } from "antd";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { selectIsSidebarCollapsed } from "../../store/slices/layout.slice.ts";
import { Logo } from "../shared/Logo.tsx";
import { HEADER_HEIGHT } from "./Layout.tsx";
import { useLocation, useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useIntl } from "react-intl";
import { userRole } from "../../utils/index.utils.ts";
import {
  BarChartOutlined,
  BookOutlined,
  HomeOutlined,
  PicRightOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { IUser } from "../../constants/interfaces/user.interfaces.ts";
import { selectAccessToken } from "../../store/slices/config.slice.ts";

const { Sider } = Layout;

export function Sidebar() {
  const location = useLocation();
  const accessToken = useAppSelector(selectAccessToken);
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const handleMenuClick: MenuProps["onClick"] = (item) => {
    navigate(item?.key);
  };

  const menuItems: Record<IUser["role"], MenuProps["items"]> = {
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
    teacher: [
      {
        key: routes.dashboard,
        label: formatMessage({ id: "dashboard" }),
        icon: <HomeOutlined />,
      },
      {
        key: routes.myCourses,
        label: formatMessage({ id: "my-courses" }),
        icon: <BookOutlined />,
      },
      {
        key: routes.courseStatistics,
        label: formatMessage({ id: "course-statistics" }),
        icon: <BarChartOutlined />,
      },
      {
        key: routes.help,
        label: formatMessage({ id: "help" }),
        icon: <QuestionCircleOutlined />,
      },
    ],
    superuser: [
      {
        key: routes.teacherApplication,
        label: formatMessage({ id: "teacher-applications" }),
        icon: <QuestionCircleOutlined />,
      },
      {
        key: routes.users,
        label: formatMessage({ id: "users" }),
        icon: <UserOutlined />,
      },
      {
        key: routes.courses,
        label: formatMessage({ id: "courses" }),
        icon: <SnippetsOutlined />,
      },
    ],
  };

  const finalMenuItems = accessToken
    ? menuItems[userRole]
    : [
        {
          key: routes.courses,
          label: formatMessage({ id: "courses" }),
          icon: <SnippetsOutlined />,
        },
        {
          key: routes.help,
          label: formatMessage({ id: "help" }),
          icon: <QuestionCircleOutlined />,
        },
      ];

  const activeTabKey = finalMenuItems?.find(
    (item) => location.pathname === item?.key,
  )?.key;

  return (
    <Sider
      style={{ background: colorBgContainer }}
      trigger={null}
      collapsible
      collapsed={isSidebarCollapsed}
      width={250}
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
        selectedKeys={[String(activeTabKey)]}
        items={finalMenuItems}
      />
    </Sider>
  );
}
