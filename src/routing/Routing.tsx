import { Route, Routes } from "react-router";
import { routes } from "../constants/routes.ts";
import { Login } from "../pages/public/Login.tsx";
import { Register } from "../pages/public/Register.tsx";
import { PublicRoutes } from "./PublicRoutes.tsx";
import { PrivateRoutes } from "./PrivateRoutes.tsx";
import { Courses } from "../pages/Courses.tsx";
import { NotFoundPage } from "../components/result-pages/NotFound.tsx";
import { CourseDetailsPage } from "../pages/CourseDetailsPage.tsx";
import { UserProfilePage } from "../pages/Profile.tsx";
import { Settings } from "../pages/Settings.tsx";
import { ChapterPage } from "../pages/student/ChapterPage.tsx";
import { mockChapter } from "../placeholder/chapter.ts";
import { ExamPage } from "../pages/student/ExamPage.tsx";
import { mockExam } from "../placeholder/exam.ts";
import { MyCourses } from "../pages/MyCourses.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { TeacherApplicationsPage } from "../pages/student/ApplyTeacher.tsx";
import { ForgotPassword } from "../pages/public/ForgotPassword.tsx";
import { Layout } from "../components/common/Layout.tsx";
import { Help } from "../pages/Help.tsx";

export function Routing() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={routes.courses} element={<Courses />} />
        <Route path={routes.help} element={<Help />} />
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.myCourses} element={<MyCourses />} />
        <Route path={routes.courseById()} element={<CourseDetailsPage />} />
        <Route path={routes.profile} element={<UserProfilePage />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route
          path={routes.chapterById()}
          element={<ChapterPage chapter={mockChapter} />}
        />
        <Route
          path={routes.examById()}
          element={<ExamPage exam={mockExam} />}
        />
        <Route
          path={routes.teacherApplication}
          element={<TeacherApplicationsPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
