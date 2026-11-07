import { List, Typography } from "antd";
import { useIntl } from "react-intl";
import type { IUser } from "../../constants/interfaces/user.interfaces.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import { localeOptions } from "../../constants/locales.ts";

const { Text } = Typography;

interface ProfileInfoTabProps {
  user: IUser;
}

export function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  const { formatMessage } = useIntl();
  const notSet = formatMessage({ id: "not-set" });
  const language = localeOptions.find(
    (option) => option.value === user.preferredLanguage,
  )?.label;

  const rows = [
    { title: formatMessage({ id: "first-name" }), value: user.firstName },
    { title: formatMessage({ id: "last-name" }), value: user.lastName },
    { title: formatMessage({ id: "email" }), value: user.email },
    {
      title: formatMessage({ id: "country" }),
      value: user.country?.name ?? notSet,
    },
    { title: formatMessage({ id: "language" }), value: language ?? notSet },
    { title: formatMessage({ id: "role" }), value: formatMessage({ id: user.role }) },
    { title: formatMessage({ id: "joined" }), value: getDMY(user.createdAt) },
  ];

  return (
    <div style={{ padding: "16px 8px" }}>
      <List
        itemLayout="horizontal"
        dataSource={rows}
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
