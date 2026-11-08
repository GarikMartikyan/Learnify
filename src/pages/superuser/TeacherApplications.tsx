import { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Descriptions,
  Flex,
  Input,
  message,
  Modal,
  Result,
  Select,
  Space,
  Table,
  Typography,
  theme,
  type TableProps,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { ApplicationStatusTag } from "../../components/applications/ApplicationStatusTag.tsx";
import { ApplicationDocumentList } from "../../components/applications/ApplicationDocumentList.tsx";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import {
  useApproveApplicationMutation,
  useGetApplicationsQuery,
  useRejectApplicationMutation,
} from "../../api/auth.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type {
  ApplicationStatus,
  ITeacherApplication,
} from "../../constants/interfaces/user.interfaces.ts";

const { Text, Paragraph, Title } = Typography;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

type Decision = "approve" | "reject";

/** Admin: review teacher applications (list, view documents, approve / reject). */
export function TeacherApplicationsPage() {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const { role } = useCurrentUser();

  // Show every application by default; decided ones stay visible (with only "View")
  const [status, setStatus] = useState<ApplicationStatus | undefined>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<ITeacherApplication | null>(null);
  const [decision, setDecision] = useState<{
    application: ITeacherApplication;
    type: Decision;
  } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data, isFetching } = useGetApplicationsQuery(
    { status, page, size: pageSize },
    { skip: role !== "admin" },
  );
  const [approve, { isLoading: isApproving }] = useApproveApplicationMutation();
  const [reject, { isLoading: isRejecting }] = useRejectApplicationMutation();

  if (role !== "admin") {
    return (
      <Result
        status="403"
        title="403"
        subTitle={formatMessage({ id: "admin-only" })}
      />
    );
  }

  const openDecision = (application: ITeacherApplication, type: Decision) => {
    setAdminNotes("");
    setDecision({ application, type });
  };

  const confirmDecision = async () => {
    if (!decision) return;
    const args = {
      applicationId: decision.application.id,
      adminNotes: adminNotes.trim() || undefined,
    };
    try {
      if (decision.type === "approve") {
        await approve(args).unwrap();
        message.success(formatMessage({ id: "application-approved" }));
      } else {
        await reject(args).unwrap();
        message.success(formatMessage({ id: "application-rejected" }));
      }
      setDecision(null);
      setSelected(null);
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  const decisionButtons = (application: ITeacherApplication) =>
    application.status === "pending" && (
      <>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => openDecision(application, "approve")}
        >
          {formatMessage({ id: "approve" })}
        </Button>
        <Button
          danger
          icon={<CloseOutlined />}
          onClick={() => openDecision(application, "reject")}
        >
          {formatMessage({ id: "reject" })}
        </Button>
      </>
    );

  const columns: TableProps<ITeacherApplication>["columns"] = [
    {
      title: formatMessage({ id: "applicant" }),
      key: "applicant",
      width: 240,
      sorter: (a, b) =>
        `${a.applicant.firstName} ${a.applicant.lastName}`.localeCompare(
          `${b.applicant.firstName} ${b.applicant.lastName}`,
        ),
      render: (_, record) => (
        <Flex vertical style={{ minWidth: 0 }}>
          <Text strong>
            {record.applicant.firstName} {record.applicant.lastName}
          </Text>
          {/* Keep the email on one line; a very long one is cut with "…" (full text on hover) */}
          <Text type="secondary" ellipsis={{ tooltip: record.applicant.email }}>
            {record.applicant.email}
          </Text>
        </Flex>
      ),
    },
    {
      title: formatMessage({ id: "motivation" }),
      dataIndex: "motivation",
      key: "motivation",
      render: (text: string) =>
        text.length > 60 ? text.slice(0, 60) + "…" : text,
    },
    {
      title: formatMessage({ id: "documents" }),
      key: "documents",
      // Widths fit the longest header word ("Փաստաթղթեր") + sort icon in en/ru/am
      width: 160,
      align: "center",
      sorter: (a, b) => a.documents.length - b.documents.length,
      render: (_, record) => record.documents.length,
    },
    {
      title: formatMessage({ id: "submitted-on" }),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => getDMY(date),
    },
    {
      title: formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      width: 160,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value: ApplicationStatus) => <ApplicationStatusTag status={value} />,
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      width: 175,
      // Actions stacked vertically, each the full column width
      render: (_, record) => (
        <Flex vertical gap={8}>
          <Button icon={<EyeOutlined />} onClick={() => setSelected(record)}>
            {formatMessage({ id: "view" })}
          </Button>
          {decisionButtons(record)}
        </Flex>
      ),
    },
  ];

  return (
    <div>
      <PageTitle>{formatMessage({ id: "teacher-applications" })}</PageTitle>

      {/* Same layout as the Users and Audit Log pages: filters under the title, then the table */}
      <Flex gap={12} wrap style={{ margin: "16px 0" }}>
        <Select
          style={{ width: 230 }}
          value={status ?? "all"}
          onChange={(value) => {
            setStatus(value === "all" ? undefined : (value as ApplicationStatus));
            setPage(0);
          }}
          options={[
            { value: "all", label: formatMessage({ id: "all-statuses" }) },
            { value: "pending", label: formatMessage({ id: "pending" }) },
            { value: "approved", label: formatMessage({ id: "approved" }) },
            { value: "rejected", label: formatMessage({ id: "rejected" }) },
          ]}
        />
      </Flex>

      <Table
        tableLayout="fixed"
        scroll={{ x: 1050 }}
        columns={columns}
        dataSource={data?.content ?? []}
        rowKey="id"
        loading={isFetching}
        locale={{ emptyText: formatMessage({ id: "no-applications" }) }}
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

      {/* Details */}
      <Modal
        open={Boolean(selected)}
        title={formatMessage({ id: "teacher-application" })}
        onCancel={() => setSelected(null)}
        width={680}
        footer={
          selected && (
            <Space>
              {decisionButtons(selected)}
              <Button onClick={() => setSelected(null)}>
                {formatMessage({ id: "close" })}
              </Button>
            </Space>
          )
        }
      >
        {selected && (
          <Flex vertical gap={20} style={{ paddingTop: 8 }}>
            {/* Applicant */}
            <Flex align="center" justify="space-between" gap={12} wrap>
              <Flex align="center" gap={12}>
                <Avatar size={48} style={{ flexShrink: 0 }}>
                  {selected.applicant.firstName.charAt(0).toUpperCase()}
                  {selected.applicant.lastName.charAt(0).toUpperCase()}
                </Avatar>
                <Flex vertical>
                  <Text strong style={{ fontSize: 16 }}>
                    {selected.applicant.firstName} {selected.applicant.lastName}
                  </Text>
                  <Text type="secondary">{selected.applicant.email}</Text>
                </Flex>
              </Flex>
              <ApplicationStatusTag status={selected.status} />
            </Flex>

            <Descriptions
              bordered
              size="small"
              column={1}
              styles={{ label: { width: 160 } }}
            >
              <Descriptions.Item label={formatMessage({ id: "submitted-on" })}>
                {getDMY(selected.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: "documents" })}>
                {selected.documents.length}
              </Descriptions.Item>
              {selected.reviewedBy && (
                <Descriptions.Item label={formatMessage({ id: "reviewed-by" })}>
                  {selected.reviewedBy.firstName} {selected.reviewedBy.lastName}
                </Descriptions.Item>
              )}
              {selected.reviewedAt && (
                <Descriptions.Item label={formatMessage({ id: "reviewed-on" })}>
                  {getDMY(selected.reviewedAt)}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selected.adminNotes && (
              <Alert
                type={selected.status === "rejected" ? "error" : "info"}
                showIcon
                message={formatMessage({ id: "admin-note" })}
                description={
                  <span style={{ whiteSpace: "pre-wrap" }}>
                    {selected.adminNotes}
                  </span>
                }
              />
            )}

            <div>
              <Title level={5} style={{ marginTop: 0 }}>
                {formatMessage({ id: "motivation" })}
              </Title>
              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  padding: "12px 16px",
                  borderRadius: token.borderRadiusLG,
                  background: token.colorFillQuaternary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Paragraph
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}
                >
                  {selected.motivation}
                </Paragraph>
              </div>
            </div>

            <div>
              <Title level={5} style={{ marginTop: 0 }}>
                {formatMessage({ id: "attached-documents" })}
              </Title>
              <ApplicationDocumentList
                applicationId={selected.id}
                documents={selected.documents}
              />
            </div>
          </Flex>
        )}
      </Modal>

      {/* Approve / reject confirmation with an optional note */}
      <Modal
        open={Boolean(decision)}
        title={formatMessage({
          id:
            decision?.type === "approve"
              ? "approve-application-title"
              : "reject-application-title",
        })}
        okText={formatMessage({
          id: decision?.type === "approve" ? "approve" : "reject",
        })}
        okButtonProps={{ danger: decision?.type === "reject" }}
        confirmLoading={isApproving || isRejecting}
        onOk={confirmDecision}
        onCancel={() => setDecision(null)}
        cancelText={formatMessage({ id: "cancel" })}
      >
        {decision && (
          <>
            <Paragraph>
              {decision.application.applicant.firstName}{" "}
              {decision.application.applicant.lastName} (
              {decision.application.applicant.email})
            </Paragraph>
            <Input.TextArea
              rows={3}
              maxLength={2000}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={formatMessage({ id: "admin-note-placeholder" })}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
