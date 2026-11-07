import { Switch } from "antd";
import { useDispatch } from "react-redux";
import {
  selectThemeMode,
  setThemeMode,
} from "../../store/slices/config.slice.ts";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/useAppSelector.ts";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { useUpdateMeMutation } from "../../api/auth.api.ts";

export function ThemeModeSwitch() {
  const themeMode = useAppSelector(selectThemeMode);
  const dispatch = useDispatch();
  const { user } = useCurrentUser();
  const [updateMe] = useUpdateMeMutation();

  const handleChange = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    dispatch(setThemeMode(newTheme));
    // Logged in: also save it to the profile
    if (user && user.preferredTheme !== newTheme) {
      updateMe({ preferredTheme: newTheme });
    }
  };

  return (
    <Switch
      checked={themeMode === "dark"}
      unCheckedChildren={<SunOutlined />}
      checkedChildren={<MoonOutlined />}
      onChange={handleChange}
    />
  );
}
