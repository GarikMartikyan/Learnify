import { Courses } from "./Courses.tsx";
import { TeacherMyCoursesPage } from "./teacher/TeacherMyCourses.tsx";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

export const MyCourses = () => {
  const { role } = useCurrentUser();

  if (role === "teacher") {
    return <TeacherMyCoursesPage />;
  }
  return <Courses isMyCourses={true} />;
};
