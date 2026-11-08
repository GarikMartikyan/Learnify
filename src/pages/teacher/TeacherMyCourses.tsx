import { useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  Input,
  Select,
  Table,
  Typography,
  type TableProps,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { CourseStatusTag } from "../../components/courses/CourseTags.tsx";
import { compareCourseStatus } from "../../utils/course.utils.ts";
import { useGetMyCoursesQuery } from "../../api/course.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type {
  CourseLevel,
  CourseStatus,
  ICourseSummary,
} from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

/** Filter option meaning "no filter" */
const ALL = "all";
const STATUSES: CourseStatus[] = ["draft", "published", "archived"];
const LEVELS: CourseLevel[] = ["beginner", "intermediate", "advanced"];
/** A course status, "disabled" (by an admin, any status) or no filter. */
type StatusFilter = CourseStatus | "disabled" | typeof ALL;

/** The teacher's own courses (every status except deleted). */
export function TeacherMyCoursesPage() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: courses = [], isFetching } = useGetMyCoursesQuery();

  // Filters run in the browser: the teacher's courses are all loaded at once
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>(ALL);
  const [level, setLevel] = useState<CourseLevel | typeof ALL>(ALL);
  const [categoryId, setCategoryId] = useState<string>(ALL);

  // Only the categories the teacher's courses actually use
  const categories = Array.from(
    new Map(
      courses
        .filter((course) => course.category)
        .map((course) => [course.category!.id, course.category!.name]),
    ),
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const searchText = search.trim().toLowerCase();
  const filteredCourses = courses.filter(
    (course) =>
      (!searchText || course.name.toLowerCase().includes(searchText)) &&
      (status === ALL ||
        (status === "disabled" ? course.disabled : course.status === status)) &&
      (level === ALL || course.level === level) &&
      (categoryId === ALL || course.category?.id === categoryId),
  );
  const isFiltered =
    Boolean(searchText) || status !== ALL || level !== ALL || categoryId !== ALL;

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
          {/* Live courses: "View" (what students see); others: "Preview" of the teacher's own copy */}
          {course.status === "published" && !course.disabled ? (
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(routes.courseById(course.id))}
            >
              {formatMessage({ id: "view" })}
            </Button>
          ) : (
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`${routes.courseById(course.id)}?preview`)}
            >
              {formatMessage({ id: "preview" })}
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

      {/* Same filter row as the Course Management and Users pages */}
      <Flex gap={12} wrap style={{ margin: "16px 0" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder={formatMessage({ id: "search-courses-placeholder" })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          style={{ width: 230 }}
          value={status}
          onChange={setStatus}
          options={[
            { value: ALL, label: formatMessage({ id: "all-statuses" }) },
            ...STATUSES.map((s) => ({
              value: s,
              label: formatMessage({ id: `course-status-${s}` }),
            })),
            { value: "disabled", label: formatMessage({ id: "disabled" }) },
          ]}
        />
        <Select
          style={{ width: 230 }}
          value={level}
          onChange={setLevel}
          options={[
            { value: ALL, label: formatMessage({ id: "all-levels" }) },
            ...LEVELS.map((l) => ({ value: l, label: formatMessage({ id: l }) })),
          ]}
        />
        <Select
          showSearch
          optionFilterProp="label"
          style={{ width: 230 }}
          value={categoryId}
          onChange={setCategoryId}
          options={[
            { value: ALL, label: formatMessage({ id: "all-categories" }) },
            ...categories.map(([id, name]) => ({ value: id, label: name })),
          ]}
        />
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredCourses}
        loading={isFetching}
        locale={{
          emptyText: formatMessage({
            id: isFiltered ? "no-courses-found" : "no-own-courses",
          }),
        }}
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
      />
    </div>
  );
}
