import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
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

  const columns: TableProps<ICourseSummary>["columns"] = [
    {
      title: formatMessage({ id: "course" }),
      key: "name",
      render: (_, course) => (
        <Space direction="vertical" size={0}>
          <Text strong>{course.name}</Text>
          <Text type="secondary">{course.category?.name}</Text>
        </Space>
      ),
    },
    {
      title: formatMessage({ id: "teacher" }),
      key: "teacher",
      render: (_, course) =>
        [course.teacher.firstName, course.teacher.lastName]
          .filter(Boolean)
          .join(" ") || (
          <Text type="secondary">{formatMessage({ id: "unknown-user" })}</Text>
        ),
    },
    {
      title: formatMessage({ id: "level" }),
      dataIndex: "level",
      key: "level",
      render: (level) => <CourseLevelTag level={level} />,
    },
    {
      title: formatMessage({ id: "status" }),
      key: "status",
      render: (_, course) => (
        <CourseStatusTag status={course.status} disabled={course.disabled} />
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
        </Space>
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
          style={{ width: 260 }}
        />
        <Select
          allowClear
          style={{ width: 180 }}
          placeholder={formatMessage({ id: "filter-by-status" })}
          value={status}
          onChange={(value?: CourseStatus) => {
            setStatus(value);
            setPage(0);
          }}
          options={STATUSES.map((s) => ({
            value: s,
            label: formatMessage({ id: `course-status-${s}` }),
          }))}
        />
        <Select
          allowClear
          style={{ width: 180 }}
          placeholder={formatMessage({ id: "filter-by-visibility" })}
          value={disabled === undefined ? undefined : String(disabled)}
          onChange={(value?: string) => {
            setDisabled(value === undefined ? undefined : value === "true");
            setPage(0);
          }}
          options={[
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
        scroll={{ x: true }}
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
