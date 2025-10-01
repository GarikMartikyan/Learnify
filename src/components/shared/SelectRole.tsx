import { Select, type SelectProps } from "antd";
import { useIntl } from "react-intl";

export function SelectRole({ ...rest }: SelectProps) {
  const { formatMessage } = useIntl();
  const options = [
    {
      label: formatMessage({ id: "student", defaultMessage: "Student" }),
      value: "student",
    },
    {
      label: formatMessage({ id: "teacher", defaultMessage: "Teacher" }),
      value: "teacher",
    },
  ];
  return (
    <Select
      options={options}
      placeholder={formatMessage({
        id: "select-role",
        defaultMessage: "Select your role",
      })}
      {...rest}
    />
  );
}
