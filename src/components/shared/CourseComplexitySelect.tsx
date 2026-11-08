import { Select, type SelectProps } from "antd";
import { useIntl } from "react-intl";
import type { CourseLevel } from "../../constants/interfaces/courseApi.interfaces.ts";

interface CourseComplexitySelectProps extends SelectProps {
  /** Adds an "All Levels" option with the value null (for filters). */
  showAllOption?: boolean;
}

const LEVELS: CourseLevel[] = ["beginner", "intermediate", "advanced"];

/** The level of a course: beginner / intermediate / advanced. */
export function CourseComplexitySelect({
  showAllOption = false,
  ...rest
}: CourseComplexitySelectProps) {
  const { formatMessage } = useIntl();

  const options = LEVELS.map((level) => ({
    label: formatMessage({ id: level }),
    value: level,
  }));

  const finalOptions: SelectProps["options"] = showAllOption
    ? [
        {
          label: formatMessage({ id: "all-levels", defaultMessage: "All Levels" }),
          value: null,
        },
        ...options,
      ]
    : options;

  return (
    <Select
      placeholder={formatMessage({ id: "complexity" })}
      {...rest}
      options={finalOptions}
    />
  );
}
