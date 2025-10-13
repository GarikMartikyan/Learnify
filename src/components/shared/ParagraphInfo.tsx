import { Typography } from "antd";

const { Text } = Typography;
export function ParagraphInfo({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}
    >
      {icon}
      <Text>{text}</Text>
    </div>
  );
}
