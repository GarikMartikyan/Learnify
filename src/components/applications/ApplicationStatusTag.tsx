import { Tag } from "antd";
import { useIntl } from "react-intl";
import type { ApplicationStatus } from "../../constants/interfaces/user.interfaces.ts";

const statusColors: Record<ApplicationStatus, string> = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

export function ApplicationStatusTag({ status }: { status: ApplicationStatus }) {
  const { formatMessage } = useIntl();
  return <Tag color={statusColors[status]}>{formatMessage({ id: status })}</Tag>;
}
