import { Select, type SelectProps } from "antd";
import { CourseLevel } from "../../placeholder/courses.ts";
import { useIntl } from "react-intl";

export function CourseComplexitySelect({ showAllOption = false, ...rest }) {
  const { formatMessage } = useIntl();

  const options = [
    {
      label: formatMessage({ id: "beginner", defaultMessage: "Beginner" }),
      value: CourseLevel.beginner,
    },
    {
      label: formatMessage({
        id: "intermediate",
        defaultMessage: "Intermediate",
      }),
      value: CourseLevel.intermediate,
    },
    {
      label: formatMessage({ id: "advanced", defaultMessage: "Advanced" }),
      value: CourseLevel.advanced,
    },
  ];

  const finalOptions: SelectProps["options"] = showAllOption
    ? [
        {
          label: formatMessage({
            id: "all",
            defaultMessage: "All Levels",
          }),
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
