import { StudentDashboardPage } from "./student/StudentDashboard.tsx";
import { TeacherDashboard } from "./teacher/TeacherDashboard.tsx";
import SuperUserDashboard from "./superuser/SuperuserDashboard.tsx";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

export function Dashboard() {
  const { role } = useCurrentUser();

  if (role === "user") {
    return <StudentDashboardPage />;
  } else if (role === "teacher") {
    return <TeacherDashboard />;
  } else if (role === "admin") {
    return <SuperUserDashboard />;
  }

  return null;
}
