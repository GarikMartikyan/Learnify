import { Courses } from "./Courses.tsx";
import { TeacherMyCoursesPage } from "./teacher/TeacherMyCourses.tsx";
import { CourseEditor } from "./teacher/CourseEditor.tsx";
import ParticipatedCoursePage from "./ParticipatedCoursePage.tsx";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

/** /my-courses — the teacher's own courses, or a student's enrolled courses. */
export const MyCourses = () => {
  const { role } = useCurrentUser();

  if (role === "teacher") {
    return <TeacherMyCoursesPage />;
  }
  return <Courses isMyCourses={true} />;
};

/**
 * /my-courses/:courseId — teachers get the course editor;
 * students keep the mock course-progress page until the Enrollment service exists.
 */
export const MyCourseDetail = () => {
  const { role } = useCurrentUser();

  if (role === "teacher") {
    return <CourseEditor />;
  }
  return <ParticipatedCoursePage />;
};
