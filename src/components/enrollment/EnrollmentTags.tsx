import { Tag } from "antd";
import { useIntl } from "react-intl";
import type { EnrollmentStatus } from "../../constants/interfaces/enrollment.interfaces.ts";

const statusColors: Record<EnrollmentStatus, string> = {
  active: "processing",
  abandoned: "default",
  completed: "success",
};

/** "In progress" / "Left" / "Completed". */
export function EnrollmentStatusTag({ status }: { status: EnrollmentStatus }) {
  const { formatMessage } = useIntl();
  return (
    <Tag color={statusColors[status]}>
      {formatMessage({ id: `enrollment-status-${status}` })}
    </Tag>
  );
}
