import { Layout as AntLayout, theme } from "antd";
import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { Outlet } from "react-router";

const { Content } = AntLayout;
export const HEADER_HEIGHT = 64;

export const Layout = () => {
  const { token } = theme.useToken();
  const { colorBgContainer, borderRadiusLG } = token;

  return (
    <AntLayout>
      <Sidebar />
      <AntLayout>
        <Header />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
