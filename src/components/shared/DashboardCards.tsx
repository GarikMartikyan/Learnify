import type { ReactNode } from "react";
import { Card, Empty, Flex, Statistic, Tag, theme, Typography } from "antd";
import { useIntl } from "react-intl";
import { useDashboardCardStyle } from "../../hooks/useDashboardCardStyle.ts";

const { Text } = Typography;

interface StatTileProps {
  title: string;
  value?: number;
  /** Shown after the number, e.g. "%". */
  suffix?: string;
  icon: ReactNode;
  loading?: boolean;
  /** Highlight the number (something needs attention). */
  highlight?: boolean;
  footer?: ReactNode;
  onClick?: () => void;
  /** Not available yet: shows "Coming soon" instead of a number. */
  comingSoon?: boolean;
}

/** One number at the top of a dashboard, with an icon and an optional footer line. */
export function StatTile({
  title,
  value,
  suffix,
  icon,
  loading,
  highlight,
  footer,
  onClick,
  comingSoon,
}: StatTileProps) {
  const { token } = theme.useToken();
  const { formatMessage } = useIntl();
  const cardStyle = useDashboardCardStyle();

  return (
    <Card hoverable={Boolean(onClick)} onClick={onClick} style={cardStyle}>
      <Flex justify="space-between" align="start" gap={12}>
        {comingSoon ? (
          <Flex vertical gap={8}>
            <Text type="secondary">{title}</Text>
            <Tag style={{ width: "fit-content" }}>
              {formatMessage({ id: "coming-soon" })}
            </Tag>
          </Flex>
        ) : (
          <Statistic
            title={title}
            value={value ?? 0}
            suffix={suffix}
            loading={loading}
            valueStyle={highlight ? { color: token.colorWarning } : undefined}
          />
        )}
        <span style={{ fontSize: 24, color: token.colorTextTertiary }}>{icon}</span>
      </Flex>
      {footer && <div style={{ marginTop: 8 }}>{footer}</div>}
    </Card>
  );
}

/** Card for a feature whose backend is not available yet. */
export function ComingSoonCard({ title, text }: { title: string; text: string }) {
  const { formatMessage } = useIntl();
  const cardStyle = useDashboardCardStyle();

  return (
    <Card
      title={title}
      extra={<Tag>{formatMessage({ id: "coming-soon" })}</Tag>}
      style={cardStyle}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text} />
    </Card>
  );
}
