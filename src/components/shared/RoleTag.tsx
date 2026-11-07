import { Tag } from "antd";
import { useIntl } from "react-intl";
import type { UserRole } from "../../constants/types/index.types.ts";

const roleColors: Record<UserRole, string> = {
  user: "green",
  teacher: "blue",
  admin: "purple",
};

/** Colored, translated role label ("User" / "Teacher" / "Admin"). */
export function RoleTag({ role }: { role: UserRole }) {
  const { formatMessage } = useIntl();
  return (
    <Tag
      style={{ paddingInline: 10, paddingBlock: 2 }}
      color={roleColors[role]}
    >
      {formatMessage({ id: role })}
    </Tag>
  );
}
