import { Courses } from "./Courses.tsx";
import { isTeacher } from "../utils/index.utils.ts";
import { TeacherMyCoursesPage } from "./teacher/TeacherMyCourses.tsx";

export const MyCourses = () => {
  if (isTeacher) {
    return <TeacherMyCoursesPage />;
  }
  return <Courses isMyCourses={true} />;
};
