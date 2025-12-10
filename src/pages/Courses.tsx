import { Button, Col, Flex, Row } from "antd";
import { courses } from "../placeholder/courses.ts";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { users } from "../placeholder/user.ts";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../constants/routes.ts";
import type { ICourse } from "../constants/interfaces/course.interfaces.ts";
import { CourseSearchFilters } from "../components/CourseSearchFilters.tsx";
import { PlusOutlined } from "@ant-design/icons";

export function Courses({ isMyCourses = false }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  let coursesList: ICourse[] = [...courses];
  if (isMyCourses) {
    coursesList = coursesList.slice(1, 4);
  }

  const handleCardClick = (id) => {
    if (isMyCourses) {
      navigate(routes.myCourseById(id));
    } else {
      navigate(routes.courseById(id));
    }
  };
  return (
    <>
      <Flex justify={"space-between"}>
        <PageTitle>{formatMessage({ id: "courses" })}</PageTitle>
        {isTeacher && (
          <Link to={routes.myCourseById(123)}>
            <Button type="primary" icon={<PlusOutlined />}>
              {formatMessage({ id: "create-course" })}
            </Button>
          </Link>
        )}
      </Flex>
      <div style={{ marginBlock: 10 }}>
        <CourseSearchFilters />
      </div>

      <Row align={"stretch"} gutter={[16, 16]}>
        {coursesList.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <CourseCard
              {...course}
              onCLick={() => handleCardClick(course.id)}
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
