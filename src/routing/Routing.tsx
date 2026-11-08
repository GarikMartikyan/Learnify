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
import { ExamPage } from "../pages/student/ExamPage.tsx";
import { LearningPage } from "../pages/student/LearningPage.tsx";
import { LearningChapterPage } from "../pages/student/LearningChapterPage.tsx";
import { LearningExamPage } from "../pages/student/LearningExamPage.tsx";
import { ExamAttemptPage } from "../pages/student/ExamAttemptPage.tsx";
import { mockExam } from "../placeholder/exam.ts";
import { MyCourseDetail, MyCourses } from "../pages/MyCourses.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { TeacherApplicationsPage } from "../pages/superuser/TeacherApplications.tsx";
import { ForgotPassword } from "../pages/public/ForgotPassword.tsx";
import { Layout } from "../components/common/Layout.tsx";
import { Help } from "../pages/Help.tsx";
import { CourseEditor } from "../pages/teacher/CourseEditor.tsx";
import { ChapterEditor } from "../pages/teacher/ChapterEditor.tsx";
import { ExamEditor } from "../pages/teacher/ExamEditor.tsx";
import { ApplyToTeacher } from "../pages/student/ApplyToTeacher.tsx";
import { CourseStatistics } from "../pages/teacher/CourseStatistics.tsx";
import { Users } from "../pages/superuser/Users.tsx";
import { AuditLog } from "../pages/superuser/AuditLog.tsx";
import { ContentReports } from "../pages/superuser/ContentReports.tsx";

export function Routing() {
  return (
    <Routes>
      {/* Open to everyone, also when logged out */}
      <Route element={<Layout />}>
        <Route path={routes.courses} element={<Courses />} />
        <Route path={routes.courseById()} element={<CourseDetailsPage />} />
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
        <Route path={routes.myCourseById()} element={<MyCourseDetail />} />
        <Route path={routes.createCourse} element={<CourseEditor />} />
        <Route path={routes.editChapter()} element={<ChapterEditor />} />
        <Route path={routes.editExam()} element={<ExamEditor />} />
        <Route path={routes.profileView()} element={<UserProfilePage />} />
        <Route path={routes.profile} element={<UserProfilePage />} />
        <Route path={routes.users} element={<Users />} />
        <Route path={routes.auditLog} element={<AuditLog />} />
        <Route path={routes.contentReports} element={<ContentReports />} />
        <Route path={routes.settings} element={<Settings />} />
        <Route path={routes.courseStatistics} element={<CourseStatistics />} />
        <Route path={routes.chapterById()} element={<ChapterPage />} />
        <Route path={routes.learning()} element={<LearningPage />} />
        <Route path={routes.learningChapter()} element={<LearningChapterPage />} />
        <Route path={routes.learningExam()} element={<LearningExamPage />} />
        <Route path={routes.examAttempt()} element={<ExamAttemptPage />} />
        <Route
          path={routes.examById()}
          element={<ExamPage exam={mockExam} />}
        />
        <Route
          path={routes.teacherApplication}
          element={<TeacherApplicationsPage />}
        />
        <Route path={routes.applyToTeacher} element={<ApplyToTeacher />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
