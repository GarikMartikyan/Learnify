import { Image, Select } from "antd";
import enFlag from "../../assets/flags/gb.svg";
import amFlag from "../../assets/flags/am.svg";
import { useDispatch } from "react-redux";
import { selectLocale, setLocale } from "../../store/slices/config.slice.ts";
import type { Locale } from "../../constants/types/index.types.ts";
import { useAppSelector } from "../../hooks/useAppSelector.ts";

export function LocaleSelect() {
  const locale = useAppSelector(selectLocale);
  const dispatch = useDispatch();
  const options = [
    {
      label: (
        <Image
          style={{ height: 16, aspectRatio: "4/3" }}
          src={enFlag}
          preview={false}
        />
      ),
      value: "en",
    },
    {
      label: (
        <Image
          style={{ height: 16, aspectRatio: "4/3" }}
          src={amFlag}
          preview={false}
        />
      ),
      value: "am",
    },
  ];
  const handleChange = (value: Locale) => {
    dispatch(setLocale(value));
  };
  return <Select value={locale} onChange={handleChange} options={options} />;
}
