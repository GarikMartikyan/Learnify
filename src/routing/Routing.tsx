import { Route, Routes } from "react-router";
import { routes } from "../constants/routes.ts";
import { Login } from "../pages/Login.tsx";
import { Register } from "../pages/Register.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { Help } from "../pages/Help.tsx";
import { PublicRoutes } from "./PublicRoutes.tsx";
import { PrivateRoutes } from "./PrivateRoutes.tsx";

export function Routing() {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.help} element={<Help />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
