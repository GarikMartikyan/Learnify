import { Button, Flex, Input, Layout, Space, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ThemeModeSwitch } from "../shared/ThemeModeSwitch.tsx";
import { useDispatch } from "react-redux";
import {
  selectIsSidebarCollapsed,
  toggleSidebarCollapsed,
} from "../../store/slices/layout.slice.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { LocaleSelect } from "../shared/LocaleSelect.tsx";
import { HeaderDropdown } from "./HeaderDropdown.tsx";
import { HEADER_HEIGHT } from "./Layout.tsx";
import { useIntl } from "react-intl";

const { Header: AntdHeader } = Layout;

export function Header() {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const { colorBgContainer } = token;

  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(toggleSidebarCollapsed());
  };

  return (
    <AntdHeader style={{ padding: 0, background: colorBgContainer }}>
      <Flex
        style={{ height: HEADER_HEIGHT, padding: "0 16px" }}
        justify={"space-between"}
        align={"center"}
      >
        <Button
          type="text"
          icon={
            isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={toggleSidebar}
          style={{
            fontSize: "16px",
            height: 32,
          }}
        />
        <div style={{ maxWidth: 500, width: "100%" }}>
          <Input
            suffix={<SearchOutlined />}
            placeholder={formatMessage({ id: "search-course" })}
          />
        </div>
        <Space align={"center"} size={"middle"}>
          <LocaleSelect />
          <ThemeModeSwitch />
          <HeaderDropdown />
        </Space>
      </Flex>
    </AntdHeader>
  );
}
