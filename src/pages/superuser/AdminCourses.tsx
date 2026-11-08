import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Typography,
  type TableProps,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import {
  CourseLevelTag,
  CourseStatusTag,
} from "../../components/courses/CourseTags.tsx";
import { compareCourseStatus, LEVEL_ORDER } from "../../utils/course.utils.ts";
import {
  useGetAdminCoursesQuery,
  useSetCourseDisabledMutation,
} from "../../api/course.api.ts";
import { routes } from "../../constants/routes.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type {
  CourseStatus,
  ICourseSummary,
} from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SEARCH_DELAY_MS = 400;
const STATUSES: CourseStatus[] = ["draft", "published", "archived"];
/** Filter option meaning "no filter" */
const ALL = "all";

/** Admin: every course (any status) with search / status / disabled filters, and disable / enable. */
export function AdminCourses() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CourseStatus | undefined>();
  const [disabled, setDisabled] = useState<boolean | undefined>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching } = useGetAdminCoursesQuery({
    search: search || undefined,
    status,
    disabled,
    page,
    size: pageSize,
  });
  const [setCourseDisabled] = useSetCourseDisabledMutation();

  const toggleDisabled = async (course: ICourseSummary) => {
    try {
      await setCourseDisabled({
        courseId: course.id,
        disabled: !course.disabled,
      }).unwrap();
      message.success(
        formatMessage(
          { id: course.disabled ? "course-enabled" : "course-disabled" },
          { name: course.name },
        ),
      );
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  const teacherName = (course: ICourseSummary) =>
    [course.teacher.firstName, course.teacher.lastName].filter(Boolean).join(" ");

  // Widths fit the longest header word / tag / button in en, ru and am
  const columns: TableProps<ICourseSummary>["columns"] = [
    {
      title: formatMessage({ id: "course" }),
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, course) => (
        <Flex vertical style={{ minWidth: 0 }}>
          <Text strong>{course.name}</Text>
          <Text type="secondary">{course.category?.name}</Text>
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "teacher" }),
      key: "teacher",
      width: 180,
      sorter: (a, b) => teacherName(a).localeCompare(teacherName(b)),
      render: (_, course) =>
        teacherName(course) || (
          <Text type="secondary">{formatMessage({ id: "unknown-user" })}</Text>
        ),
    },
    {
      title: formatMessage({ id: "level" }),
      dataIndex: "level",
      key: "level",
      width: 140,
      sorter: (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
      render: (level) => <CourseLevelTag level={level} />,
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
      width: 175,
      // Actions stacked vertically, each the full column width
      render: (_, course) => (
        <Flex vertical gap={8}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(routes.courseById(course.id))}
          >
            {formatMessage({ id: "view" })}
          </Button>
          <Popconfirm
            title={formatMessage(
              { id: course.disabled ? "enable-course-confirm" : "disable-course-confirm" },
              { name: course.name },
            )}
            okText={formatMessage({ id: "yes" })}
            cancelText={formatMessage({ id: "no" })}
            onConfirm={() => toggleDisabled(course)}
          >
            {course.disabled ? (
              <Button icon={<CheckCircleOutlined />}>
                {formatMessage({ id: "enable" })}
              </Button>
            ) : (
              <Button danger icon={<StopOutlined />}>
                {formatMessage({ id: "disable" })}
              </Button>
            )}
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      <PageTitle>{formatMessage({ id: "course-management" })}</PageTitle>
      <Flex gap={12} wrap>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder={formatMessage({ id: "search-courses-placeholder" })}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: 300 }}
        />
        {/* Same "All" filters as the Users page */}
        <Select
          style={{ width: 230 }}
          value={status ?? ALL}
          onChange={(value: CourseStatus | typeof ALL) => {
            setStatus(value === ALL ? undefined : value);
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-statuses" }) },
            ...STATUSES.map((s) => ({
              value: s,
              label: formatMessage({ id: `course-status-${s}` }),
            })),
          ]}
        />
        <Select
          style={{ width: 250 }}
          value={disabled === undefined ? ALL : String(disabled)}
          onChange={(value: string) => {
            setDisabled(value === ALL ? undefined : value === "true");
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-visibility" }) },
            { value: "false", label: formatMessage({ id: "enabled" }) },
            { value: "true", label: formatMessage({ id: "disabled" }) },
          ]}
        />
      </Flex>
      <Table
        columns={columns}
        dataSource={data?.content ?? []}
        rowKey="id"
        loading={isFetching}
        locale={{ emptyText: formatMessage({ id: "no-courses-found" }) }}
        tableLayout="fixed"
        scroll={{ x: 1050 }}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements ?? 0,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onChange: (newPage, newPageSize) => {
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setPage(0);
            } else {
              setPage(newPage - 1);
            }
          },
        }}
      />
    </Flex>
  );
}
