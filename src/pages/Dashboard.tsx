import { userRole } from "../utils/index.utils.ts";
import { StudentDashboardPage } from "./student/StudentDashboard.tsx";
import { TeacherDashboard } from "./teacher/TeacherDashboard.tsx";
import SuperUserDashboard from "./superuser/SuperuserDashboard.tsx";

export function Dashboard() {
  if (userRole === "student") {
    return <StudentDashboardPage />;
  } else if (userRole === "teacher") {
    return <TeacherDashboard />;
  } else if (userRole === "superuser") {
    return <SuperUserDashboard />;
  }

  return null;
}
