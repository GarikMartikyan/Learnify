import { Route, Routes } from "react-router";
import { routes } from "../constants/routes.ts";
import { Login } from "../pages/Login.tsx";
import { Register } from "../pages/Register.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { Help } from "../pages/Help.tsx";
import { PublicRoutes } from "./PublicRoutes.tsx";
import { PrivateRoutes } from "./PrivateRoutes.tsx";
import { Courses } from "../pages/Courses.tsx";
import { NotFoundPage } from "../components/result-pages/NotFound.tsx";
import { CourseDetailsPage } from "../pages/CourseDetailsPage.tsx";
import { UserProfilePage } from "../pages/Profile.tsx";
import { Settings } from "../pages/Settings.tsx";

export function Routing() {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path={routes.help} element={<Help />} />
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.courses} element={<Courses />} />
        <Route path={routes.courseById()} element={<CourseDetailsPage />} />
        <Route path={routes.profile} element={<UserProfilePage />} />
        <Route path={routes.settings} element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
