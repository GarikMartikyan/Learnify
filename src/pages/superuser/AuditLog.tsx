import { useState } from "react";
import {
  Button,
  DatePicker,
  Flex,
  Result,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import {
  useGetAuditFiltersQuery,
  useGetAuditLogQuery,
} from "../../api/audit.api.ts";
import { routes } from "../../constants/routes.ts";
import type {
  IAuditActor,
  IAuditLogEntry,
} from "../../constants/interfaces/audit.interfaces.ts";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

/** Admin: the audit log of admin actions, with filters and pagination. */
export function AuditLog() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { role } = useCurrentUser();

  const [action, setAction] = useState<string | undefined>();
  const [entityType, setEntityType] = useState<string | undefined>();
  const [actorId, setActorId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const isAdmin = role === "admin";
  const from = dateRange?.[0]?.startOf("day");
  // "to" is exclusive on the backend: use the start of the day after the chosen end date
  const to = dateRange?.[1]?.add(1, "day").startOf("day");

  const { data, isFetching, refetch } = useGetAuditLogQuery(
    {
      action,
      entityType,
      actorId,
      from: from?.toISOString(),
      to: to?.toISOString(),
      page,
      size: pageSize,
    },
    { skip: !isAdmin },
  );
  const { data: filters, refetch: refetchFilters } = useGetAuditFiltersQuery(
    undefined,
    { skip: !isAdmin },
  );

  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="403"
        subTitle={formatMessage({ id: "admin-only" })}
      />
    );
  }

  /** Translated label if one exists (e.g. for actions, roles, statuses), otherwise the raw value. */
  const label = (key: string, fallback: string = key) =>
    intl.messages[key] ? formatMessage({ id: key }) : fallback;

  const actionLabel = (value: string) => label(`audit-action.${value}`, value);
  const entityLabel = (value: string) => label(`audit-entity.${value}`, value);

  const actorName = (actor: IAuditActor | null) => {
    if (!actor) return formatMessage({ id: "system" });
    if (actor.firstName || actor.lastName) {
      return `${actor.firstName ?? ""} ${actor.lastName ?? ""}`.trim();
    }
    return formatMessage({ id: "unknown-user" });
  };

  /** "role: User → Teacher" for every field that appears in the old or new value. */
  const renderChange = (entry: IAuditLogEntry) => {
    const keys = Array.from(
      new Set([
        ...Object.keys(entry.oldValue ?? {}),
        ...Object.keys(entry.newValue ?? {}),
      ]),
    );
    if (keys.length === 0) return <Text type="secondary">—</Text>;
    const show = (value: unknown) =>
      value === undefined || value === null ? "—" : label(String(value));
    return (
      <Space direction="vertical" size={0}>
        {keys.map((key) => (
          <Text key={key}>
            <Text type="secondary">{label(key)}: </Text>
            {show(entry.oldValue?.[key])} → <Text strong>{show(entry.newValue?.[key])}</Text>
          </Text>
        ))}
      </Space>
    );
  };

  const resetPage = () => setPage(0);

  const columns: TableProps<IAuditLogEntry>["columns"] = [
    {
      title: formatMessage({ id: "date-time" }),
      dataIndex: "createdAt",
      key: "createdAt",
      // Widths fit the longest header word / tag / value in en, ru and am
      width: 175,
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: formatMessage({ id: "action" }),
      dataIndex: "action",
      key: "action",
      width: 200,
      // Sorted by the label the admin sees, in the current language
      sorter: (a, b) => actionLabel(a.action).localeCompare(actionLabel(b.action)),
      render: (value: string) => <Tag color="blue">{actionLabel(value)}</Tag>,
    },
    {
      title: formatMessage({ id: "entity" }),
      key: "entity",
      width: 200,
      // By entity type, then by the affected user's name
      sorter: (a, b) =>
        entityLabel(a.entityType).localeCompare(entityLabel(b.entityType)) ||
        (a.entityName ?? "").localeCompare(b.entityName ?? ""),
      render: (_, entry) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary">{entityLabel(entry.entityType)}</Text>
          {/* Affected user: their name, linking to their profile */}
          {entry.entityType === "user" && entry.entityId && (
            <Link to={routes.profileView(entry.entityId)}>
              {entry.entityName ?? formatMessage({ id: "unknown-user" })}
            </Link>
          )}
        </Space>
      ),
    },
    {
      title: formatMessage({ id: "action-by" }),
      key: "actor",
      width: 230,
      sorter: (a, b) => actorName(a.actor).localeCompare(actorName(b.actor)),
      render: (_, entry) => (
        <Flex vertical style={{ minWidth: 0 }}>
          <Text strong>{actorName(entry.actor)}</Text>
          {/* Keep the email on one line; a very long one is cut with "…" (full text on hover) */}
          {entry.actor?.email && (
            <Text type="secondary" ellipsis={{ tooltip: entry.actor.email }}>
              {entry.actor.email}
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "change" }),
      key: "change",
      render: (_, entry) => renderChange(entry),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "audit-log" })}</PageTitle>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            refetch();
            refetchFilters();
          }}
        >
          {formatMessage({ id: "refresh" })}
        </Button>
      </Flex>

      <Flex gap={12} wrap style={{ margin: "16px 0" }}>
        <Select
          allowClear
          style={{ width: 220 }}
          placeholder={formatMessage({ id: "filter-by-action" })}
          value={action}
          onChange={(value?: string) => {
            setAction(value);
            resetPage();
          }}
          options={(filters?.actions ?? []).map((value) => ({
            value,
            label: actionLabel(value),
          }))}
        />
        <Select
          allowClear
          style={{ width: 200 }}
          placeholder={formatMessage({ id: "filter-by-entity" })}
          value={entityType}
          onChange={(value?: string) => {
            setEntityType(value);
            resetPage();
          }}
          options={(filters?.entityTypes ?? []).map((value) => ({
            value,
            label: entityLabel(value),
          }))}
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          style={{ width: 240 }}
          placeholder={formatMessage({ id: "filter-by-actor" })}
          value={actorId}
          onChange={(value?: string) => {
            setActorId(value);
            resetPage();
          }}
          options={(filters?.actors ?? []).map((actor) => ({
            value: actor.id,
            label: actor.email
              ? `${actorName(actor)} (${actor.email})`
              : actorName(actor),
          }))}
        />
        <RangePicker
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={(values) => {
            setDateRange(values);
            resetPage();
          }}
          placeholder={[
            formatMessage({ id: "date-from" }),
            formatMessage({ id: "date-to" }),
          ]}
          allowEmpty={[true, true]}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={data?.content ?? []}
        rowKey="id"
        loading={isFetching}
        locale={{ emptyText: formatMessage({ id: "no-audit-entries" }) }}
        tableLayout="fixed"
        scroll={{ x: 1085 }}
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
    </div>
  );
}
