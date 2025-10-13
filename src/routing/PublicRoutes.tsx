import { Outlet } from "react-router";
import { Col, Flex, Row } from "antd";
import { ThemeModeSwitch } from "../components/shared/ThemeModeSwitch.tsx";
import { LocaleSelect } from "../components/shared/LocaleSelect.tsx";
import bgImage from "../assets/pexels-lilartsy-1925536.jpg";

export function PublicRoutes() {
  return (
    <Row style={{ minHeight: "100vh", backgroundImage: bgImage }}>
      <Col xs={24} sm={24} md={11} lg={9}>
        <Flex
          style={{ padding: "1rem" }}
          justify={"space-between"}
          align={"center"}
        >
          <ThemeModeSwitch />
          <LocaleSelect />
        </Flex>
        <Flex
          style={{ minHeight: "calc(100vh - 64px)", width: "100%" }}
          justify={"center"}
          align={"center"}
        >
          <Col xs={22} sm={16} md={20}>
            <Outlet />
          </Col>
        </Flex>
      </Col>
      <Col xs={0} sm={0} md={13} lg={15}>
        <img
          style={{
            display: "block",
            width: "100%",
            minHeight: "100vh",
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={bgImage}
          alt=""
        />
      </Col>
    </Row>
  );
}
