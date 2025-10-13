import { Image, Select, Space, Typography } from "antd";
import enFlag from "../../assets/flags/gb.svg";
import amFlag from "../../assets/flags/am.svg";
import { useDispatch } from "react-redux";
import { selectLocale, setLocale } from "../../store/slices/config.slice.ts";
import type { Locale } from "../../constants/types/index.types.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";

const { Text } = Typography;

export function LocaleSelect() {
  const locale = useAppSelector(selectLocale);
  const dispatch = useDispatch();
  const options = [
    {
      label: (
        <Space>
          <Image
            style={{ height: 16, aspectRatio: "4/3" }}
            src={enFlag}
            preview={false}
          />
          <Text>English</Text>
        </Space>
      ),
      value: "en",
    },
    {
      label: (
        <Space>
          <Image
            style={{ height: 16, aspectRatio: "4/3" }}
            src={amFlag}
            preview={false}
          />
          <Text>Հայերեն</Text>
        </Space>
      ),
      value: "am",
    },
  ];
  const handleChange = (value: Locale) => {
    dispatch(setLocale(value));
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
