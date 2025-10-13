import { Col, Row } from "antd";
import { courses } from "../placeholder/courses.ts";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { users } from "../placeholder/user.ts";
import { useIntl } from "react-intl";

export function Courses() {
  const { formatMessage } = useIntl();
  return (
    <>
      <PageTitle>{formatMessage({ id: "courses" })}</PageTitle>

      <Row align={"stretch"} gutter={[16, 16]}>
        {courses.map((course) => (
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
