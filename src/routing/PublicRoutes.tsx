import { Outlet } from "react-router";
import { Flex } from "antd";
import { ThemeModeSwitch } from "../components/shared/ThemeModeSwitch.tsx";
import { LocaleSelect } from "../components/shared/LocaleSelect.tsx";
import bgImage from "../assets/pexels-lilartsy-1925536.jpg";

export function PublicRoutes() {
  return (
    <div
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      {/* Blurred Background */}
      <img
        src={bgImage}
        alt=""
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(8px)",
          transform: "scale(1.05)",
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)", // 👈 adjust darkness (0.4 = 40% dark)
        }}
      />

      {/* Top Bar */}
      <Flex style={{ padding: "1rem" }} justify="space-between" align="center">
        <ThemeModeSwitch />
        <LocaleSelect />
      </Flex>

      {/* Content */}
      <Flex
        style={{ minHeight: "calc(100vh - 64px)" }}
        justify="center"
        align="center"
      >
        <Outlet />
      </Flex>
    </div>
  );
}
