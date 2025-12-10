import { useIntl } from "react-intl";
import { Select } from "antd";

export function CourseLanguageSelect({ showAllOptions = false, ...rest }) {
  const { formatMessage } = useIntl();
  const options = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Հայերեն",
      value: "am",
    },
  ];

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

  return <Select options={finalOptions} {...rest} />;
}
