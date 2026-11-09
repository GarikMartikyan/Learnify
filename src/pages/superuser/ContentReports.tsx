import { useState } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  Result,
  Select,
  Table,
  Tag,
  Typography,
  message,
  type TableProps,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import dayjs from "dayjs";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { routes } from "../../constants/routes.ts";
import {
  useGetAdminReportsQuery,
  useReviewReportMutation,
} from "../../api/enrollment.api.ts";
import type {
  IAdminReport,
  IPersonSummary,
  ReportEntityType,
  ReportStatus,
} from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text, Paragraph } = Typography;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];
/** Filter option meaning "no filter" */
const ALL = "all";
const STATUSES: ReportStatus[] = ["pending", "resolved", "dismissed"];
const ENTITY_TYPES: ReportEntityType[] = ["course", "chapter", "content_block"];

const statusColors: Record<ReportStatus, string> = {
  pending: "gold",
  resolved: "red",
  dismissed: "default",
};

type ReviewAction = "resolve" | "dismiss" | "restore-content";

/**
 * Admin: content reports. Resolving hides the reported item, dismissing keeps it; the decision applies to
 * every pending report of the same item. A hidden item can be shown again from its report.
 */
export function ContentReports() {
  const { formatMessage } = useIntl();
  const { role } = useCurrentUser();
  const isAdmin = role === "admin";

  const [status, setStatus] = useState<ReportStatus | undefined>("pending");
  const [entityType, setEntityType] = useState<ReportEntityType | undefined>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data, isFetching, refetch } = useGetAdminReportsQuery(
    { status, entityType, page, size: pageSize },
    { skip: !isAdmin },
  );
  const [reviewReport, { isLoading: isReviewing }] = useReviewReportMutation();

  // The report being reviewed in the dialog, and the chosen action
  const [review, setReview] = useState<{ report: IAdminReport; action: ReviewAction } | null>(null);
  const [notes, setNotes] = useState("");

  if (!isAdmin) {
    return <Result status="403" title="403" subTitle={formatMessage({ id: "admin-only" })} />;
  }

  const personName = (person: IPersonSummary | null) =>
    person && (person.firstName || person.lastName)
      ? `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim()
      : formatMessage({ id: "unknown-user" });

  const openReview = (report: IAdminReport, action: ReviewAction) => {
    setNotes("");
    setReview({ report, action });
  };

  const handleReview = async () => {
    if (!review) return;
    const result = await reviewReport({
      reportId: review.report.id,
      action: review.action,
      notes: notes.trim() || undefined,
    });
    if (!result.error) {
      message.success(formatMessage({ id: `report-${review.action}-done` }));
      setReview(null);
    }
  };

  // Sorting is in the browser, within the loaded page (like the other admin tables).
  // Widths fit the longest header (+ sorter), tag and button in en, ru and am; the reason column takes the rest.
  const columns: TableProps<IAdminReport>["columns"] = [
    {
      title: formatMessage({ id: "reported-item" }),
      key: "item",
      width: 240,
      // By title; reports whose item no longer exists go last
      sorter: (a, b) =>
        (a.entityTitle === null ? 1 : 0) - (b.entityTitle === null ? 1 : 0) ||
        (a.entityTitle ?? "").localeCompare(b.entityTitle ?? ""),
      render: (_, report) => (
        <Flex vertical gap={4} style={{ minWidth: 0 }}>
          <Flex wrap style={{ rowGap: 4 }}>
            <Tag>{formatMessage({ id: `report-entity.${report.entityType}` })}</Tag>
            {report.entityDisabled && <Tag color="red">{formatMessage({ id: "hidden" })}</Tag>}
          </Flex>
          {report.entityTitle === null ? (
            <Text type="secondary">{formatMessage({ id: "item-not-found" })}</Text>
          ) : (
            <Text strong>
              {report.entityTitle}
              {report.blockType && (
                <Text type="secondary"> · {formatMessage({ id: `block-type-${report.blockType}` })}</Text>
              )}
            </Text>
          )}
          {report.courseId && (
            <Link to={routes.courseById(report.courseId)}>
              {report.entityType === "course"
                ? formatMessage({ id: "view-course" })
                : report.courseName}
            </Link>
          )}
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "report-reason" }),
      dataIndex: "reason",
      key: "reason",
      render: (reason: string, report) => (
        <Flex vertical gap={4}>
          <Paragraph
            style={{ margin: 0 }}
            ellipsis={{ rows: 3, expandable: true, symbol: formatMessage({ id: "more" }) }}
          >
            {reason}
          </Paragraph>
          {report.reportCount > 1 && (
            <Text type="secondary">
              {formatMessage({ id: "reports-of-item" }, { count: report.reportCount })}
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "reported-by" }),
      key: "reporter",
      width: 160,
      sorter: (a, b) => personName(a.reporter).localeCompare(personName(b.reporter)),
      render: (_, report) => (
        <Link to={routes.profileView(report.reporter.id)}>{personName(report.reporter)}</Link>
      ),
    },
    {
      title: formatMessage({ id: "reported-on" }),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: formatMessage({ id: "status" }),
      key: "status",
      width: 160,
      // Pending first, then resolved, then dismissed
      sorter: (a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status),
      render: (_, report) => (
        <Flex vertical gap={4} align="start" style={{ minWidth: 0, maxWidth: "100%" }}>
          <Tag color={statusColors[report.status]}>
            {formatMessage({ id: `report-status.${report.status}` })}
          </Tag>
          {report.reviewer && (
            <Text type="secondary">
              {personName(report.reviewer)}
              {report.reviewedAt && ` · ${dayjs(report.reviewedAt).format("DD/MM/YYYY")}`}
            </Text>
          )}
          {report.adminNotes && (
            <Text italic ellipsis={{ tooltip: report.adminNotes }} style={{ maxWidth: "100%" }}>
              {report.adminNotes}
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      width: 185,
      // Actions stacked vertically, each the full column width
      render: (_, report) => (
        <Flex vertical gap={8}>
          {report.status === "pending" && (
            <>
              <Button danger onClick={() => openReview(report, "resolve")}>
                {formatMessage({ id: "report-resolve" })}
              </Button>
              <Button onClick={() => openReview(report, "dismiss")}>
                {formatMessage({ id: "report-dismiss" })}
              </Button>
            </>
          )}
          {report.status === "resolved" && report.entityDisabled && (
            <Button onClick={() => openReview(report, "restore-content")}>
              {formatMessage({ id: "report-restore-content" })}
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "content-reports" })}</PageTitle>
        <Button icon={<ReloadOutlined />} style={{ marginBottom: 16 }} onClick={() => refetch()}>
          {formatMessage({ id: "refresh" })}
        </Button>
      </Flex>

      {/* Same filter row as the Users, Courses and Audit Log pages */}
      <Flex wrap gap={12} style={{ margin: "16px 0" }}>
        <Select<ReportStatus | typeof ALL>
          value={status ?? ALL}
          style={{ width: 230 }}
          onChange={(value) => {
            setStatus(value === ALL ? undefined : value);
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-statuses" }) },
            ...STATUSES.map((value) => ({
              value,
              label: formatMessage({ id: `report-status.${value}` }),
            })),
          ]}
        />
        <Select<ReportEntityType | typeof ALL>
          value={entityType ?? ALL}
          style={{ width: 230 }}
          onChange={(value) => {
            setEntityType(value === ALL ? undefined : value);
            setPage(0);
          }}
          options={[
            { value: ALL, label: formatMessage({ id: "all-item-types" }) },
            ...ENTITY_TYPES.map((value) => ({
              value,
              label: formatMessage({ id: `report-entity.${value}` }),
            })),
          ]}
        />
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.content ?? []}
        loading={isFetching}
        tableLayout="fixed"
        scroll={{ x: 1100 }}
        locale={{ emptyText: formatMessage({ id: "no-reports" }) }}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements ?? 0,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onChange: (newPage, newSize) => {
            if (newSize !== pageSize) {
              setPageSize(newSize);
              setPage(0);
            } else {
              setPage(newPage - 1);
            }
          },
        }}
      />

      <Modal
        open={review !== null}
        title={review && formatMessage({ id: `report-${review.action}-title` })}
        okText={review && formatMessage({ id: `report-${review.action}` })}
        okButtonProps={{ danger: review?.action === "resolve" }}
        cancelText={formatMessage({ id: "cancel" })}
        confirmLoading={isReviewing}
        onOk={handleReview}
        onCancel={() => setReview(null)}
      >
        {review && (
          <Flex vertical gap={12}>
            <Text>{formatMessage({ id: `report-${review.action}-explain` })}</Text>
            <Input.TextArea
              rows={3}
              maxLength={1000}
              showCount
              value={notes}
              placeholder={formatMessage({ id: "admin-notes-optional" })}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Flex>
        )}
      </Modal>
    </div>
  );
}
