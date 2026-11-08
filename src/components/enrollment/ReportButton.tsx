import { useState } from "react";
import { Button, Form, Input, Modal, Tooltip, message } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { applyFieldErrors } from "../../api/index.api.ts";
import { useReportContentMutation } from "../../api/enrollment.api.ts";
import type { ReportEntityType } from "../../constants/interfaces/enrollment.interfaces.ts";

interface ReportButtonProps {
  entityType: ReportEntityType;
  entityId: string;
  /** iconOnly: a small flag (used next to each content block). */
  iconOnly?: boolean;
}

/** "Report" button + a dialog asking for the reason (10-1000 characters). */
export function ReportButton({ entityType, entityId, iconOnly = false }: ReportButtonProps) {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<{ reason: string }>();
  const [reportContent, { isLoading }] = useReportContentMutation();

  const title = formatMessage({ id: `report-${entityType}` });

  const handleSubmit = async ({ reason }: { reason: string }) => {
    const result = await reportContent({ entityType, entityId, reason: reason.trim() });
    if (result.error) {
      applyFieldErrors(form, result.error);
      return;
    }
    message.success(formatMessage({ id: "report-sent" }));
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      {iconOnly ? (
        <Tooltip title={title}>
          <Button type="text" size="small" icon={<FlagOutlined />} onClick={() => setOpen(true)} />
        </Tooltip>
      ) : (
        <Button icon={<FlagOutlined />} onClick={() => setOpen(true)}>
          {formatMessage({ id: "report" })}
        </Button>
      )}
      <Modal
        open={open}
        title={title}
        okText={formatMessage({ id: "send-report" })}
        cancelText={formatMessage({ id: "cancel" })}
        confirmLoading={isLoading}
        onOk={() => form.submit()}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <Form.Item
            name="reason"
            label={formatMessage({ id: "report-reason" })}
            rules={[
              { required: true, whitespace: true, message: formatMessage({ id: "report-reason-required" }) },
              { min: 10, max: 1000, message: formatMessage({ id: "report-reason-length" }) },
            ]}
          >
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
