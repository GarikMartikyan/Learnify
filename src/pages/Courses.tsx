import { Button, Col, Flex, Row, Space, Table } from "antd";
import { CourseLevel, courses } from "../placeholder/courses.ts";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { users } from "../placeholder/user.ts";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../constants/routes.ts";
import type { ICourse } from "../constants/interfaces/course.interfaces.ts";
import { CourseSearchFilters } from "../components/CourseSearchFilters.tsx";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { isSuperuser, isTeacher } from "../utils/index.utils.ts";

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

  if (isSuperuser) {
    const courses = [
      {
        id: 1,
        title: "Intro to JavaScript",
        author: "Bob Johnson",
        rating: 4.5,
        level: "intermediate",
        language: "English",
      },
      {
        id: 2,
        title: "React Basics",
        author: "Bob Johnson",
        rating: 4.7,
        level: "advanced",
        language: "English",
      },
      {
        id: 3,
        title: "Node.js Fundamentals",
        author: "Alice Smith",
        rating: 4.3,
        level: "beginner",
        language: "English",
      },
      {
        id: 4,
        title: "HTML & CSS Basics",
        author: "Charlie Brown",
        rating: 4.8,
        level: CourseLevel.intermediate,
        language: "English",
      },
      {
        id: 5,
        title: "Advanced TypeScript",
        author: "David Hakobyan",
        rating: 4.6,
        level: CourseLevel.intermediate,
        language: "English",
      },
    ];

    const courseColumns = [
      { title: "Course Title", dataIndex: "title", key: "title" },
      { title: "Author", dataIndex: "author", key: "author" },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        render: (r: number) => r?.toFixed(1),
      },
      {
        title: "Level",
        dataIndex: "level",
        key: "level",
      },
      {
        title: "Language",
        dataIndex: "language",
        key: "language",
      },
      {
        title: "Actions",
        key: "actions",
        render: () => (
          <Space>
            <Link to={routes.myCourseById("132")}>
              <Button type="primary" icon={<EyeOutlined />}>
                View
              </Button>
            </Link>
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Flex vertical gap="middle">
        <PageTitle>Course Management</PageTitle>
        <CourseSearchFilters />
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Flex>
    );
  }

  return (
    <>
      <Flex justify={"space-between"}>
        <PageTitle>
          {formatMessage({ id: isMyCourses ? "my-courses" : "courses" })}
        </PageTitle>
        {isTeacher && (
          <Link to={routes.myCourseById("123")}>
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
