import { Avatar, Button, Empty, Flex, List, Spin, theme, Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useGetMyEnrollmentsQuery } from "../../api/enrollment.api.ts";
import { getDMY } from "../../utils/date.ustils.ts";
import type { IEnrollment } from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text } = Typography;

/**
 * Profile "Passed Courses" tab: the courses the user has completed, newest first.
 * Only the user's own profile: there is no endpoint yet for another user's enrollments.
 */
export function CoursesTab({ isOwnProfile }: { isOwnProfile: boolean }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery("completed", {
    skip: !isOwnProfile,
  });

  if (!isOwnProfile) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={formatMessage({ id: "passed-courses-unavailable" })}
      />
    );
  }
  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin />
      </Flex>
    );
  }

  // A course finished more than once (re-enrolled after completing) is listed once, latest completion
  const latestByCourse = new Map<string, IEnrollment>();
  for (const enrollment of enrollments) {
    const kept = latestByCourse.get(enrollment.courseId);
    if (!kept || (enrollment.completedAt ?? "") > (kept.completedAt ?? "")) {
      latestByCourse.set(enrollment.courseId, enrollment);
    }
  }
  const passed = [...latestByCourse.values()].sort((a, b) =>
    (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
  );

  if (passed.length === 0) {
    return (
      <Empty description={formatMessage({ id: "no-passed-courses" })}>
        <Button type="primary" onClick={() => navigate(routes.courses)}>
          {formatMessage({ id: "browse-courses" })}
        </Button>
      </Empty>
    );
  }

  return (
    <List
      dataSource={passed}
      renderItem={(enrollment) => {
        const courseName = enrollment.courseName ?? formatMessage({ id: "course" });
        // Removed / disabled courses can't be opened any more
        const canOpen = Boolean(enrollment.courseName) && !enrollment.courseDisabled;
        return (
          <List.Item
            actions={
              canOpen
                ? [
                    <Button
                      key="review"
                      onClick={() => navigate(routes.learning(enrollment.courseId))}
                    >
                      {formatMessage({ id: "review-course" })}
                    </Button>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={40}
                  icon={<TrophyOutlined />}
                  style={{ background: token.colorSuccessBg, color: token.colorSuccess }}
                />
              }
              title={
                <Text strong ellipsis={{ tooltip: courseName }}>
                  {courseName}
                </Text>
              }
              description={
                canOpen
                  ? enrollment.completedAt &&
                    formatMessage(
                      { id: "completed-on" },
                      { date: getDMY(enrollment.completedAt) },
                    )
                  : formatMessage({ id: "course-unavailable" })
              }
            />
          </List.Item>
        );
      }}
    />
  );
}
