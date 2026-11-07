import { useState } from "react";
import {
  Button,
  Card,
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

const { Text, Paragraph } = Typography;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

type Decision = "approve" | "reject";

/** Admin: review teacher applications (list, view documents, approve / reject). */
export function TeacherApplicationsPage() {
  const { formatMessage } = useIntl();
  const { role } = useCurrentUser();

  const [status, setStatus] = useState<ApplicationStatus | undefined>("pending");
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
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            {record.applicant.firstName} {record.applicant.lastName}
          </Text>
          <Text type="secondary">{record.applicant.email}</Text>
        </Space>
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
      align: "center",
      render: (_, record) => record.documents.length,
    },
    {
      title: formatMessage({ id: "submitted-on" }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => getDMY(date),
    },
    {
      title: formatMessage({ id: "status" }),
      dataIndex: "status",
      key: "status",
      render: (value: ApplicationStatus) => <ApplicationStatusTag status={value} />,
    },
    {
      title: formatMessage({ id: "actions" }),
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button icon={<EyeOutlined />} onClick={() => setSelected(record)}>
            {formatMessage({ id: "view" })}
          </Button>
          {decisionButtons(record)}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "auto" }}>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "teacher-applications" })}</PageTitle>
        <Select
          style={{ width: 200 }}
          value={status ?? "all"}
          onChange={(value) => {
            setStatus(value === "all" ? undefined : (value as ApplicationStatus));
            setPage(0);
          }}
          options={[
            { value: "pending", label: formatMessage({ id: "pending" }) },
            { value: "approved", label: formatMessage({ id: "approved" }) },
            { value: "rejected", label: formatMessage({ id: "rejected" }) },
            { value: "all", label: formatMessage({ id: "all-statuses" }) },
          ]}
        />
      </Flex>

      <Card
        style={{
          marginTop: 16,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Table
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
      </Card>

      {/* Details */}
      <Modal
        open={Boolean(selected)}
        title={
          selected &&
          `${selected.applicant.firstName} ${selected.applicant.lastName}`
        }
        onCancel={() => setSelected(null)}
        width={650}
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
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={formatMessage({ id: "email" })}>
                {selected.applicant.email}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: "submitted-on" })}>
                {getDMY(selected.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: "status" })}>
                <ApplicationStatusTag status={selected.status} />
              </Descriptions.Item>
              {selected.reviewedBy && (
                <Descriptions.Item label={formatMessage({ id: "reviewed-by" })}>
                  {selected.reviewedBy.firstName} {selected.reviewedBy.lastName}
                  {selected.reviewedAt && ` (${getDMY(selected.reviewedAt)})`}
                </Descriptions.Item>
              )}
              {selected.adminNotes && (
                <Descriptions.Item label={formatMessage({ id: "admin-note" })}>
                  {selected.adminNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Text strong>{formatMessage({ id: "motivation" })}:</Text>
            <Paragraph style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>
              {selected.motivation}
            </Paragraph>

            <Text strong>{formatMessage({ id: "attached-documents" })}:</Text>
            <ApplicationDocumentList
              applicationId={selected.id}
              documents={selected.documents}
            />
          </>
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
