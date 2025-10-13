import { List, Typography } from "antd";
import type { IUser } from "../../constants/interfaces/user.interfaces.ts";
import { getDMY } from "../../utils/date.ustils.ts";

const { Text } = Typography;

interface ProfileInfoTabProps {
  user: IUser;
}

export function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  return (
    <div style={{ padding: "16px 8px" }}>
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: "Full Name",
            value: user.name,
          },
          {
            title: "Email",
            value: user.email,
          },
          {
            title: "Country",
            value: user.country,
          },
          {
            title: "Joined",
            value: getDMY(user.joinedAt),
          },
          {
            title: "Role",
            value: user.role,
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.title}: </Text>&nbsp;
            <Text>{item.value}</Text>
          </List.Item>
        )}
      />
    </div>
  );
}
