import { Flex, Layout, Menu, type MenuProps, theme } from "antd";
import {
  UnorderedListOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { selectIsSidebarCollapsed } from "../../store/slices/layout.slice.ts";
import { Logo } from "../shared/Logo.tsx";
import { HEADER_HEIGHT } from "./Layout.tsx";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useIntl } from "react-intl";

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
        items={[
          {
            key: routes.courses,
            icon: <UnorderedListOutlined />,
            label: formatMessage({ id: "courses" }),
          },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: "nav 2",
          },
          {
            key: "3",
            icon: <UploadOutlined />,
            label: "nav 3",
          },
        ]}
      />
    </Sider>
  );
}
