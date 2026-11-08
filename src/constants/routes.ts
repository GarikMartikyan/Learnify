export const routes = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  courses: "/",
  applyToTeacher: "/apply-to-teacher",
  courseById: (courseId = ":courseId") => `/courses/${courseId}`,
  chapterById: (chapterId = ":chapterId") => `/chapters/${chapterId}`,
  examById: (examId = ":examId") => `/exams/${examId}`,
  myCourses: "/my-courses",
  myCourseById: (courseId = ":courseId") => `/my-courses/${courseId}`,
  /** A student's learning view of an enrolled course. */
  learning: (courseId = ":courseId") => `/learning/${courseId}`,
  /** A chapter opened by an enrolled student. */
  learningChapter: (courseId = ":courseId", chapterId = ":chapterId") =>
    `/learning/${courseId}/chapters/${chapterId}`,
  profile: "/profile",
  settings: "/settings",
  userById: (userId = ":userId") => `/users/${userId}`,
  help: "/help",
  forgotPassword: "/forgot-password",
  teacherApplication: "/teacher-application",
  users: "/users",
  auditLog: "/audit-log",
  editChapter: (chapterId: string = ":chapterId") =>
    `/edit-chapter/${chapterId}`,
  editExam: (examId: string = ":examId") => `/edit-exam/${examId}`,
  courseStatistics: "/course-statistics",
  createCourse: "/create-course",
  profileView: (userId: string = ":userId") => `/profile/${userId}`,
} as const;
