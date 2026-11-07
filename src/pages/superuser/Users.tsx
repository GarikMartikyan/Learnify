import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  Result,
  Select,
  Space,
  Table,
  Tag,
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
import { routes } from "../../constants/routes.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { RoleTag } from "../../components/shared/RoleTag.tsx";
import { UserAvatar } from "../../components/shared/UserAvatar.tsx";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import {
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useGetUsersQuery,
} from "../../api/auth.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type { IUser } from "../../constants/interfaces/user.interfaces.ts";
import type {
  AccountStatus,
  UserRole,
} from "../../constants/types/index.types.ts";

const { Text, Paragraph } = Typography;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SEARCH_DELAY_MS = 400;
const ROLES: UserRole[] = ["user", "teacher", "admin"];
/** Filter option meaning "no filter" */
const ALL = "all";

/** Admin: list/search users, suspend/activate, change role. Users are never deleted. */
export function Users() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { user: currentUser, role } = useCurrentUser();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();
  const [statusFilter, setStatusFilter] = useState<AccountStatus | undefined>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [roleChange, setRoleChange] = useState<{
    user: IUser;
    newRole: UserRole;
  } | null>(null);

  // Search after the admin stops typing, not on every key press
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching } = useGetUsersQuery(
    {
      search: search || undefined,
      role: roleFilter,
      status: statusFilter,
      page,
      size: pageSize,
    },
    { skip: role !== "admin" },
  );
  const [changeRole, { isLoading: isChangingRole }] =
    useChangeUserRoleMutation();
  const [changeStatus] = useChangeUserStatusMutation();

  if (role !== "admin") {
    return (
      <Result
        status="403"
        title="403"
        subTitle={formatMessage({ id: "admin-only" })}
      />
    );
  }

  const fullName = (user: IUser) => `${user.firstName} ${user.lastName}`;

  const handleStatusChange = async (user: IUser) => {
    const newStatus: AccountStatus =
      user.status === "active" ? "suspended" : "active";
    try {
      await changeStatus({ userId: user.id, status: newStatus }).unwrap();
      message.success(
        formatMessage(
          { id: newStatus === "suspended" ? "user-suspended" : "user-activated" },
          { name: fullName(user) },
        ),
      );
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  const confirmRoleChange = async () => {
    if (!roleChange) return;
    try {
      await changeRole({
        userId: roleChange.user.id,
        role: roleChange.newRole,
      }).unwrap();
      message.success(
        formatMessage(
          { id: "role-changed" },
          {
            name: fullName(roleChange.user),
            role: formatMessage({ id: roleChange.newRole }),
          },
        ),
      );
      setRoleChange(null);
    } catch {
      // The error message is shown as a toast by the base query
      // (e.g. the Course service is unavailable when demoting a teacher)
    }
  };

  const columns: TableProps<IUser>["columns"] = [
    {
      title: formatMessage({ id: "name" }),
      key: "name",
      width: 280,
      sorter: (a, b) => fullName(a).localeCompare(fullName(b)),
      render: (_, user) => (
        <Flex align="center" gap={8}>
          <UserAvatar user={user} style={{ flexShrink: 0 }} />
          <Flex vertical style={{ minWidth: 0 }}>
            <Space size={4}>
              <Text strong>{fullName(user)}</Text>
              {user.id === currentUser?.id && (
                <Tag>{formatMessage({ id: "you" })}</Tag>
              )}
            </Space>
            {/* Keep the email on one line; a very long one is cut with "…" (full text on hover) */}
            <Text type="secondary" ellipsis={{ tooltip: user.email }}>
              {user.email}
            </Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "role" }),
      dataIndex: "role",
      key: "role",
      // Widths fit the longest header word / tag / button in en, ru and am
      width: 150,
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (value: UserRole) => <RoleTag role={value} />,
    },
    {
      title: formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      width: 160,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value: AccountStatus) => (
        <Tag color={value === "active" ? "green" : "red"}>
          {formatMessage({ id: value })}
        </Tag>
      ),
    },
    {
      title: formatMessage({ id: "country" }),
      key: "country",
      width: 150,
      sorter: (a, b) =>
        (a.country?.name ?? "").localeCompare(b.country?.name ?? ""),
      render: (_, user) =>
        user.country?.name ?? (
          <Text type="secondary">{formatMessage({ id: "not-set" })}</Text>
        ),
    },
    {
      title: formatMessage({ id: "joined" }),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => getDMY(date),
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      width: 195,
      render: (_, user) => {
        const isSelf = user.id === currentUser?.id;
        // Actions stacked vertically, each the full column width
        return (
          <Flex vertical gap={8}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(routes.profileView(user.id))}
            >
              {formatMessage({ id: "view" })}
            </Button>
            {/* Admins cannot change their own role or status (the backend refuses it too) */}
            {!isSelf && (
              <>
                <Select
                  style={{ width: "100%" }}
                  value={user.role}
                  onChange={(newRole: UserRole) =>
                    setRoleChange({ user, newRole })
                  }
                  options={ROLES.map((r) => ({
                    value: r,
                    label: formatMessage({ id: r }),
                  }))}
                />
                <Popconfirm
                  title={formatMessage(
                    {
                      id:
                        user.status === "active"
                          ? "suspend-confirm"
                          : "activate-confirm",
                    },
                    { name: fullName(user) },
                  )}
                  okText={formatMessage({ id: "yes" })}
                  cancelText={formatMessage({ id: "no" })}
                  onConfirm={() => handleStatusChange(user)}
                >
                  {user.status === "active" ? (
                    <Button danger icon={<StopOutlined />}>
                      {formatMessage({ id: "suspend" })}
                    </Button>
                  ) : (
                    <Button icon={<CheckCircleOutlined />}>
                      {formatMessage({ id: "activate" })}
                    </Button>
                  )}
                </Popconfirm>
              </>
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle>{formatMessage({ id: "users-management" })}</PageTitle>

      <Flex gap={12} wrap style={{ marginBottom: 16 }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder={formatMessage({ id: "search-users-placeholder" })}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: 310 }}
        />
        <Select
          style={{ width: 230 }}
          value={roleFilter ?? ALL}
          onChange={(value: UserRole | typeof ALL) => {
            setRoleFilter(value === ALL ? undefined : value);
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-roles" }) },
            ...ROLES.map((r) => ({
              value: r,
              label: formatMessage({ id: r }),
            })),
          ]}
        />
        <Select
          style={{ width: 230 }}
          value={statusFilter ?? ALL}
          onChange={(value: AccountStatus | typeof ALL) => {
            setStatusFilter(value === ALL ? undefined : value);
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-statuses" }) },
            { value: "active", label: formatMessage({ id: "active" }) },
            { value: "suspended", label: formatMessage({ id: "suspended" }) },
          ]}
        />
      </Flex>

      <Table
        tableLayout="fixed"
        scroll={{ x: 1085 }}
        columns={columns}
        dataSource={data?.content ?? []}
        rowKey="id"
        loading={isFetching}
        locale={{ emptyText: formatMessage({ id: "no-users" }) }}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements ?? 0,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onChange: (newPage, newPageSize) => {
            if (newPageSize !== pageSize) {
              // A different page size: start again from the first page
              setPageSize(newPageSize);
              setPage(0);
            } else {
              setPage(newPage - 1);
            }
          },
        }}
      />

      {/* Role change confirmation */}
      <Modal
        open={Boolean(roleChange)}
        title={formatMessage({ id: "change-role" })}
        okText={formatMessage({ id: "change-role" })}
        cancelText={formatMessage({ id: "cancel" })}
        confirmLoading={isChangingRole}
        onOk={confirmRoleChange}
        onCancel={() => setRoleChange(null)}
      >
        {roleChange && (
          <>
            <Paragraph>
              {formatMessage(
                { id: "change-role-confirm" },
                {
                  name: fullName(roleChange.user),
                  role: formatMessage({ id: roleChange.newRole }),
                },
              )}
            </Paragraph>
            {roleChange.user.role === "teacher" && (
              <Paragraph type="warning">
                {formatMessage({ id: "teacher-demotion-warning" })}
              </Paragraph>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
