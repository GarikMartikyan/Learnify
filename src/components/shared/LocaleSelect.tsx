import { Image, Select, Space, Typography } from "antd";
import { useDispatch } from "react-redux";
import { selectLocale, setLocale } from "../../store/slices/config.slice.ts";
import type { Locale } from "../../constants/types/index.types.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { useUpdateMeMutation } from "../../api/auth.api.ts";
import { localeOptions } from "../../constants/locales.ts";

const { Text } = Typography;

export function LocaleSelect() {
  const locale = useAppSelector(selectLocale);
  const dispatch = useDispatch();
  const { user } = useCurrentUser();
  const [updateMe] = useUpdateMeMutation();

  const options = localeOptions.map(({ value, label, flag }) => ({
    value,
    label: (
      <Space>
        <Image
          style={{ height: 16, aspectRatio: "4/3" }}
          src={flag}
          preview={false}
        />
        <Text>{label}</Text>
      </Space>
    ),
  }));

  const handleChange = (value: Locale) => {
    dispatch(setLocale(value));
    // Logged in: also save it to the profile
    if (user && user.preferredLanguage !== value) {
      updateMe({ preferredLanguage: value });
    }
  };

  return (
    <Select
      style={{ minWidth: 140 }}
      className="selectLocale"
      value={locale}
      onChange={handleChange}
      options={options}
    />
  );
}
