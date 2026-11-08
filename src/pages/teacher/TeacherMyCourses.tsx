import { Avatar, Button, Flex, Table, Typography, type TableProps } from "antd";
import { EditOutlined, EyeOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { CourseStatusTag } from "../../components/courses/CourseTags.tsx";
import { compareCourseStatus } from "../../utils/course.utils.ts";
import { useGetMyCoursesQuery } from "../../api/course.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type { ICourseSummary } from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

/** The teacher's own courses (every status except deleted). */
export function TeacherMyCoursesPage() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: courses = [], isFetching } = useGetMyCoursesQuery();

  // Widths fit the longest header word / tag / button in en, ru and am
  const columns: TableProps<ICourseSummary>["columns"] = [
    {
      title: formatMessage({ id: "course" }),
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, course) => (
        <Flex align="center" gap={12}>
          <Avatar
            shape="square"
            size={48}
            src={course.coverImageUrl ?? undefined}
            icon={<PictureOutlined />}
            style={{ flexShrink: 0 }}
          />
          <Flex vertical style={{ minWidth: 0 }}>
            <Text strong>{course.name}</Text>
            <Text type="secondary">{course.category?.name}</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "status" }),
      key: "status",
      width: 160,
      sorter: compareCourseStatus,
      render: (_, course) => (
        <CourseStatusTag status={course.status} disabled={course.disabled} />
      ),
    },
    {
      title: formatMessage({ id: "content" }),
      key: "content",
      width: 200,
      // By number of chapters, then exams
      sorter: (a, b) =>
        a.chapterCount - b.chapterCount || a.examCount - b.examCount,
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
      width: 150,
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (date: string) => getDMY(date),
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      width: 190,
      // Actions stacked vertically, each the full column width
      render: (_, course) => (
        <Flex vertical gap={8}>
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
        </Flex>
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
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />
    </div>
  );
}
