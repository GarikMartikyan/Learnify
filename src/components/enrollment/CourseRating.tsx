import { Card, Flex, Rate, Space, Typography, message } from "antd";
import { useIntl } from "react-intl";
import {
  useGetMyRatingQuery,
  useGetRatingSummariesQuery,
  useRateCourseMutation,
} from "../../api/enrollment.api.ts";
import type { IRatingSummary } from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text } = Typography;

/** Stars + "4.5 (12)", or "No ratings yet". */
export function RatingStars({
  summary,
  size = "small",
}: {
  summary?: IRatingSummary;
  size?: "small" | "default";
}) {
  const { formatMessage } = useIntl();
  if (!summary || summary.count === 0) {
    return <Text type="secondary">{formatMessage({ id: "no-ratings-yet" })}</Text>;
  }
  return (
    <Space size={6} align="center">
      <Rate
        disabled
        allowHalf
        value={Math.round(summary.average * 2) / 2}
        style={{ fontSize: size === "small" ? 14 : 18 }}
      />
      <Text type="secondary">
        {summary.average.toFixed(1)} ({summary.count})
      </Text>
    </Space>
  );
}

/** The average rating of one course (loads it by itself). */
export function CourseRatingSummary({ courseId }: { courseId: string }) {
  const { data } = useGetRatingSummariesQuery([courseId]);
  return <RatingStars summary={data?.[0]} size="default" />;
}

/** "Your rating" on the learning view: rate or change the rating once 50 % of the course is done. */
export function MyRatingCard({ courseId }: { courseId: string }) {
  const { formatMessage } = useIntl();
  const { data: mine } = useGetMyRatingQuery(courseId);
  const [rateCourse, { isLoading }] = useRateCourseMutation();

  if (!mine) {
    return null;
  }

  const handleRate = async (rating: number) => {
    if (rating < 1) return;
    const result = await rateCourse({ courseId, rating });
    if (!result.error) {
      message.success(formatMessage({ id: "rating-saved" }));
    }
  };

  return (
    <Card variant="borderless" style={{ marginTop: 24, borderRadius: 16 }}>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <Space direction="vertical" size={2}>
          <Text strong>{formatMessage({ id: "your-rating" })}</Text>
          <Text type="secondary">
            {mine.canRate
              ? formatMessage({ id: mine.rating ? "rating-change-hint" : "rating-ask" })
              : formatMessage({ id: "rating-locked" }, { percent: mine.minProgressPercent })}
          </Text>
        </Space>
        <Rate
          value={mine.rating ?? 0}
          disabled={!mine.canRate || isLoading}
          allowClear={false}
          onChange={handleRate}
          style={{ fontSize: 28 }}
        />
      </Flex>
    </Card>
  );
}
