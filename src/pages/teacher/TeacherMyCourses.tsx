import { Avatar, Button, Flex, Space, Table, Typography, type TableProps } from "antd";
import { EditOutlined, EyeOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { CourseStatusTag } from "../../components/courses/CourseTags.tsx";
import { useGetMyCoursesQuery } from "../../api/course.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type { ICourseSummary } from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

/** The teacher's own courses (every status except deleted). */
export function TeacherMyCoursesPage() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: courses = [], isFetching } = useGetMyCoursesQuery();

  const columns: TableProps<ICourseSummary>["columns"] = [
    {
      title: formatMessage({ id: "course" }),
      key: "name",
      render: (_, course) => (
        <Space>
          <Avatar
            shape="square"
            size={48}
            src={course.coverImageUrl ?? undefined}
            icon={<PictureOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{course.name}</Text>
            <Text type="secondary">{course.category?.name}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: formatMessage({ id: "status" }),
      key: "status",
      render: (_, course) => (
        <CourseStatusTag status={course.status} disabled={course.disabled} />
      ),
    },
    {
      title: formatMessage({ id: "content" }),
      key: "content",
      render: (_, course) => (
        <Text type="secondary">
          {formatMessage({ id: "chapter-count" }, { count: course.chapterCount })}
          {" · "}
          {formatMessage({ id: "exam-count" }, { count: course.examCount })}
        </Text>
      ),
    },
    {
      title: formatMessage({ id: "updated" }),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => getDMY(date),
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      render: (_, course) => (
        <Space wrap>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(routes.myCourseById(course.id))}
          >
            {formatMessage({ id: "edit" })}
          </Button>
          {course.status === "published" && !course.disabled && (
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(routes.courseById(course.id))}
            >
              {formatMessage({ id: "view" })}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "my-courses" })}</PageTitle>
        <Link to={routes.createCourse}>
          <Button type="primary" icon={<PlusOutlined />}>
            {formatMessage({ id: "create-course" })}
          </Button>
        </Link>
      </Flex>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={courses}
        loading={isFetching}
        locale={{ emptyText: formatMessage({ id: "no-own-courses" }) }}
        scroll={{ x: true }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />
    </div>
  );
}
