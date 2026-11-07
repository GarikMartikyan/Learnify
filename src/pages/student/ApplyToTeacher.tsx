import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Result,
  Spin,
  Typography,
  Upload,
  type UploadFile,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import {
  useGetMyApplicationsQuery,
  useSubmitApplicationMutation,
} from "../../api/auth.api.ts";
import { applyFieldErrors } from "../../api/index.api.ts";
import { ApplicationDocumentList } from "../../components/applications/ApplicationDocumentList.tsx";
import { getDMY } from "../../utils/date.ustils.ts";
import {
  APPLICATION_DOCUMENT_TYPES,
  MAX_APPLICATION_DOCUMENTS,
  MAX_DOCUMENT_SIZE_BYTES,
  MOTIVATION_MAX_LENGTH,
  MOTIVATION_MIN_LENGTH,
} from "../../constants/global.constants.ts";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ApplyFormValues {
  motivation: string;
}

/**
 * "Apply to become a teacher" (role "user" only).
 * Shows the latest application's state: pending → under review, approved → done,
 * rejected (or none yet) → the form to apply.
 */
export function ApplyToTeacher() {
  const { formatMessage } = useIntl();
  const { role, refetch: refetchMe } = useCurrentUser();
  const [form] = Form.useForm<ApplyFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const canApply = role === "user";
  const { data: applications = [], isLoading } = useGetMyApplicationsQuery(
    undefined,
    { skip: !canApply },
  );
  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitApplicationMutation();

  const latest = applications[0];

  // Approved while logged in: reload the user so the new "teacher" role shows up
  useEffect(() => {
    if (latest?.status === "approved") {
      refetchMe();
    }
  }, [latest?.status, refetchMe]);

  if (!canApply) {
    return (
      <Result
        status="info"
        title={formatMessage({
          id: role === "teacher" ? "already-teacher" : "apply-not-available",
        })}
      />
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (latest?.status === "pending") {
    return (
      <Result
        status="info"
        title={formatMessage({ id: "application-pending-title" })}
        subTitle={formatMessage(
          { id: "application-pending-text" },
          { date: getDMY(latest.createdAt) },
        )}
        extra={
          <Card
            title={formatMessage({ id: "attached-documents" })}
            style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}
          >
            <ApplicationDocumentList
              applicationId={latest.id}
              documents={latest.documents}
            />
          </Card>
        }
      />
    );
  }

  if (latest?.status === "approved") {
    return (
      <Result
        status="success"
        title={formatMessage({ id: "application-approved-title" })}
      />
    );
  }

  /** Checks type and size before a file is added to the list (nothing is uploaded yet). */
  const beforeUpload = (file: File) => {
    if (!APPLICATION_DOCUMENT_TYPES.includes(file.type)) {
      message.error(
        formatMessage({ id: "document-invalid-type" }, { name: file.name }),
      );
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      message.error(
        formatMessage({ id: "document-too-large" }, { name: file.name }),
      );
      return Upload.LIST_IGNORE;
    }
    // Keep the file in the list; it is sent together with the form
    return false;
  };

  const handleSubmit = async (values: ApplyFormValues) => {
    const files = fileList
      .map((file) => file.originFileObj)
      .filter((file): file is NonNullable<typeof file> => Boolean(file));
    if (files.length === 0) {
      message.error(formatMessage({ id: "documents-required" }));
      return;
    }
    try {
      await submitApplication({ motivation: values.motivation, files }).unwrap();
      message.success(formatMessage({ id: "application-submitted" }));
      form.resetFields();
      setFileList([]);
      // The applications list reloads and the page switches to "under review"
    } catch (error) {
      applyFieldErrors(form, error);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <Title level={3}>{formatMessage({ id: "apply-title" })}</Title>
      <Text type="secondary">{formatMessage({ id: "apply-intro" })}</Text>

      {latest?.status === "rejected" && (
        <Alert
          style={{ marginTop: 24 }}
          type="warning"
          showIcon
          message={formatMessage({ id: "application-rejected-title" })}
          description={
            <>
              {latest.adminNotes && (
                <div>
                  <Text strong>{formatMessage({ id: "admin-note" })}: </Text>
                  <Text>{latest.adminNotes}</Text>
                </div>
              )}
              <div>{formatMessage({ id: "apply-again" })}</div>
            </>
          }
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label={formatMessage({ id: "motivation" })}
          name="motivation"
          rules={[
            {
              required: true,
              whitespace: true,
              message: formatMessage({ id: "motivation-required" }),
            },
            {
              min: MOTIVATION_MIN_LENGTH,
              max: MOTIVATION_MAX_LENGTH,
              message: formatMessage({ id: "motivation-length" }),
            },
          ]}
        >
          <TextArea
            rows={6}
            showCount
            maxLength={MOTIVATION_MAX_LENGTH}
            placeholder={formatMessage({ id: "motivation-placeholder" })}
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: "documents" })}
          required
          extra={formatMessage({ id: "documents-hint" })}
        >
          <Upload
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            maxCount={MAX_APPLICATION_DOCUMENTS}
            beforeUpload={beforeUpload}
            fileList={fileList}
            onChange={({ fileList: newList }) => setFileList(newList)}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={fileList.length >= MAX_APPLICATION_DOCUMENTS}
            >
              {formatMessage({ id: "upload-documents" })}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
          >
            {formatMessage({ id: "submit-application" })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
