import { Button, Col, Flex, Row, Space, Table } from "antd";
import { courses } from "../placeholder/courses.ts";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { users } from "../placeholder/user.ts";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../constants/routes.ts";
import type { ICourse } from "../constants/interfaces/course.interfaces.ts";
import { CourseSearchFilters } from "../components/CourseSearchFilters.tsx";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
    interface Course {
      id: number;
      title: string;
      author: string;
      rating: number;
    }
    const courses: Course[] = [
      {
        id: 1,
        title: "Intro to JavaScript",
        author: "Bob Johnson",
        rating: 4.5,
      },
      { id: 2, title: "React Basics", author: "Bob Johnson", rating: 4.7 },
      {
        id: 3,
        title: "Node.js Fundamentals",
        author: "Alice Smith",
        rating: 4.3,
      },
      {
        id: 4,
        title: "HTML & CSS Basics",
        author: "Charlie Brown",
        rating: 4.8,
      },
      {
        id: 5,
        title: "Advanced TypeScript",
        author: "David Hakobyan",
        rating: 4.6,
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
        title: "Actions",
        key: "actions",
        render: () => (
          <Space>
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
