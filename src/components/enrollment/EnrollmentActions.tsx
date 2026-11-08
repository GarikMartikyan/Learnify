import { Button, Space, Spin, message } from "antd";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import {
  useEnrollMutation,
  useGetCourseEnrollmentQuery,
} from "../../api/enrollment.api.ts";
import { EnrollmentStatusTag } from "./EnrollmentTags.tsx";

/**
 * The join / continue buttons on a course page (for users and for teachers on other teachers' courses).
 * Logged out: "Join Course" leads to the login page.
 */
export function EnrollmentActions({ courseId }: { courseId: string }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { isLoggedIn } = useCurrentUser();
  const { data: enrollment, isLoading } = useGetCourseEnrollmentQuery(courseId, {
    skip: !isLoggedIn,
  });
  const [enroll, { isLoading: isEnrolling }] = useEnrollMutation();

  const joinAndOpen = async () => {
    const result = await enroll(courseId);
    if (!result.error) {
      message.success(formatMessage({ id: "enrolled-successfully" }));
      navigate(routes.learning(courseId));
    }
  };

  if (!isLoggedIn) {
    return (
      <Button type="primary" size="large" onClick={() => navigate(routes.login)}>
        {formatMessage({ id: "join-course" })}
      </Button>
    );
  }
  if (isLoading) {
    return <Spin />;
  }

  // Never enrolled
  if (!enrollment) {
    return (
      <Button type="primary" size="large" loading={isEnrolling} onClick={joinAndOpen}>
        {formatMessage({ id: "join-course" })}
      </Button>
    );
  }

  return (
    <Space wrap>
      <EnrollmentStatusTag status={enrollment.status} />
      {enrollment.status === "active" && (
        <Button type="primary" size="large" onClick={() => navigate(routes.learning(courseId))}>
          {formatMessage({ id: "continue-course" })} ({enrollment.progressPercent}%)
        </Button>
      )}
      {enrollment.status === "abandoned" && (
        <Button type="primary" size="large" loading={isEnrolling} onClick={joinAndOpen}>
          {formatMessage({ id: "restore-course" })}
        </Button>
      )}
      {enrollment.status === "completed" && (
        <>
          <Button size="large" onClick={() => navigate(routes.learning(courseId))}>
            {formatMessage({ id: "review-course" })}
          </Button>
          <Button type="primary" size="large" loading={isEnrolling} onClick={joinAndOpen}>
            {formatMessage({ id: "enroll-again" })}
          </Button>
        </>
      )}
    </Space>
  );
}
