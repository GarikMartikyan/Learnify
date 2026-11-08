import { useIntl } from "react-intl";
import { Select, type SelectProps } from "antd";
import { localeOptions } from "../../constants/locales.ts";

interface CourseLanguageSelectProps extends SelectProps {
  /** Adds an "All Languages" option with the value null (for filters). */
  showAllOptions?: boolean;
}

/** The language a course is taught in: en / am / ru. */
export function CourseLanguageSelect({
  showAllOptions = false,
  ...rest
}: CourseLanguageSelectProps) {
  const { formatMessage } = useIntl();
  const options = localeOptions.map(({ value, label }) => ({ value, label }));

  const finalOptions = showAllOptions
    ? [
        {
          label: formatMessage({
            id: "all-languages",
            defaultMessage: "All Languages",
          }),
          value: null,
        },
        ...options,
      ]
    : options;

  return (
    <Select
      options={finalOptions}
      placeholder={formatMessage({ id: "language" })}
      {...rest}
    />
  );
}
