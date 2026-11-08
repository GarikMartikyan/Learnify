import { Tag } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import type {
  CourseLanguage,
  CourseLevel,
  CourseStatus,
} from "../../constants/interfaces/courseApi.interfaces.ts";
import { localeOptions } from "../../constants/locales.ts";

const levelColors: Record<CourseLevel, string> = {
  beginner: "green",
  intermediate: "gold",
  advanced: "volcano",
};

const statusColors: Record<CourseStatus, string> = {
  draft: "default",
  published: "green",
  archived: "orange",
};

export function CourseLevelTag({ level }: { level: CourseLevel }) {
  const { formatMessage } = useIntl();
  return <Tag color={levelColors[level]}>{formatMessage({ id: level })}</Tag>;
}

export function CourseLanguageTag({ language }: { language: CourseLanguage }) {
  const label =
    localeOptions.find((option) => option.value === language)?.label ?? language;
  return (
    <Tag color="blue" icon={<GlobalOutlined />}>
      {label}
    </Tag>
  );
}

/** Status of a course, plus a red "Disabled" tag when an admin disabled it. */
export function CourseStatusTag({
  status,
  disabled = false,
}: {
  status: CourseStatus;
  disabled?: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <>
      <Tag color={statusColors[status]}>
        {formatMessage({ id: `course-status-${status}` })}
      </Tag>
      {disabled && <Tag color="red">{formatMessage({ id: "disabled" })}</Tag>}
    </>
  );
}
