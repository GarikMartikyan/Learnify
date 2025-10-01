import { Switch } from "antd";
import { useDispatch } from "react-redux";
import { setThemeMode } from "../../store/slices/config.slice.ts";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export function ThemeModeSwitch() {
  const dispatch = useDispatch();
  const handelChange = (value: boolean) => {
    dispatch(setThemeMode(value ? "dark" : "light"));
  };
  return (
    <Switch
      unCheckedChildren={<SunOutlined />}
      checkedChildren={<MoonOutlined />}
      onChange={handelChange}
    />
  );
}
