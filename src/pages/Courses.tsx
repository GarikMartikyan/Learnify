import { Col, Row } from "antd";
import { courses } from "../placeholder/courses.ts";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { users } from "../placeholder/user.ts";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { routes } from "../constants/routes.ts";
import type { ICourse } from "../constants/interfaces/course.interfaces.ts";
import { CourseSearchFiltesr } from "../components/CourseSearchFiltesr.tsx";

export function Courses() {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  let coursesList: ICourse[] = [...courses];
  if (pathname === routes.myCourses) {
    coursesList = coursesList.slice(1, 4);
  }
  return (
    <>
      <PageTitle>{formatMessage({ id: "courses" })}</PageTitle>
      <div style={{ marginBlock: 10 }}>
        <CourseSearchFiltesr />
      </div>

      <Row align={"stretch"} gutter={[16, 16]}>
        {coursesList.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <CourseCard
              {...course}
              teacherName={
                users.find((user) => user.id === course.teacherId)?.name || ""
              }
              teacherImage={
                users.find((user) => user.id === course.teacherId)?.avatarUrl ||
                ""
              }
            />
          </Col>
        ))}
      </Row>
    </>
  );
}
