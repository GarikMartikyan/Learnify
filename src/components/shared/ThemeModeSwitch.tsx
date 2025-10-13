import { Switch } from "antd";
import { useDispatch } from "react-redux";
import {
  selectThemeMode,
  setThemeMode,
} from "../../store/slices/config.slice.ts";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/useAppSelector.ts";

export function ThemeModeSwitch() {
  const themeMode = useAppSelector(selectThemeMode);
  const dispatch = useDispatch();
  const handelChange = (value: boolean) => {
    dispatch(setThemeMode(value ? "dark" : "light"));
  };
  const isDarkMode = themeMode === "dark";
  return (
    <Switch
      defaultChecked={isDarkMode}
      unCheckedChildren={<SunOutlined />}
      checkedChildren={<MoonOutlined />}
      onChange={handelChange}
    />
  );
}
