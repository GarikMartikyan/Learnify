export const routes = {
  login: "/login",
  register: "/register",
  dashboard: "/",
  courses: "/courses",
  myCourses: "/my-courses",
  profile: "/profile",
  settings: "/settings",
  userById: (userId = ":userId") => `/users/${userId}`,
  courseById: (courseId = ":courseId") => `/courses/${courseId}`,
  //TODO: add help route
  help: "/help",
} as const;
