import { Route, Routes } from "react-router";
import { routes } from "../constants/routes.ts";
import { Login } from "../pages/Login.tsx";
import { Register } from "../pages/Register.tsx";
import { Help } from "../pages/Help.tsx";
import { PublicRoutes } from "./PublicRoutes.tsx";
import { PrivateRoutes } from "./PrivateRoutes.tsx";
import { Courses } from "../pages/Courses.tsx";
import { NotFoundPage } from "../components/result-pages/NotFound.tsx";
import { CourseDetailsPage } from "../pages/CourseDetailsPage.tsx";
import { UserProfilePage } from "../pages/Profile.tsx";
import { Settings } from "../pages/Settings.tsx";
import { ChapterPage } from "../pages/ChapterPage.tsx";
import { mockChapter } from "../placeholder/chapter.ts";
import { ExamPage } from "../pages/ExamPage.tsx";
import { mockExam } from "../placeholder/exam.ts";
import { MyCourses } from "../pages/MyCourses.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { ApplyToTeacher } from "../pages/ApplyTeacher.tsx";

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
        <Route path={routes.applyToTeacher} element={<ApplyToTeacher />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
