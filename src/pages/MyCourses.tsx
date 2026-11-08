import { Navigate, useParams } from "react-router";
import { Tabs } from "antd";
import { useIntl } from "react-intl";
import { TeacherMyCoursesPage } from "./teacher/TeacherMyCourses.tsx";
import { CourseEditor } from "./teacher/CourseEditor.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { EnrolledCourses } from "../components/enrollment/EnrolledCourses.tsx";
import { routes } from "../constants/routes.ts";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

/**
 * /my-courses — a user's enrolled courses. Teachers get two tabs: the courses they teach and the
 * courses they joined as a student.
 */
export const MyCourses = () => {
  const { formatMessage } = useIntl();
  const { role } = useCurrentUser();

  if (role === "teacher") {
    return (
      <Tabs
        items={[
          {
            key: "teaching",
            label: formatMessage({ id: "teaching-courses" }),
            children: <TeacherMyCoursesPage />,
          },
          {
            key: "learning",
            label: formatMessage({ id: "learning-courses" }),
            children: <EnrolledCourses />,
          },
        ]}
      />
    );
  }
  return (
    <>
      <PageTitle>{formatMessage({ id: "my-courses" })}</PageTitle>
      <EnrolledCourses />
    </>
  );
};

/** /my-courses/:courseId — teachers get the course editor; students go to the learning view. */
export const MyCourseDetail = () => {
  const { role } = useCurrentUser();
  const { courseId = "" } = useParams();

  if (role === "teacher") {
    return <CourseEditor />;
  }
  return <Navigate to={routes.learning(courseId)} replace />;
};
