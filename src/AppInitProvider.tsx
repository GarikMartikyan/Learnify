import type { ReactNode } from "react";
import { App, ConfigProvider, Layout, theme as antTheme } from "antd";
import { useAppSelector } from "./hooks/useAppSelector.ts";
import { themes } from "./constants/themes.ts";
import { IntlProvider } from "react-intl";
import { messages } from "./i18n/index.i18n.ts";
import { selectLocale, selectThemeMode } from "./store/slices/config.slice.ts";

export function AppInitProvider({ children }: { children: ReactNode }) {
  const themeMode = useAppSelector(selectThemeMode);
  const locale = useAppSelector(selectLocale);
  const isDarkMode = themeMode === "dark";

  const finalTheme = themes["dark"];
  const { defaultAlgorithm, darkAlgorithm } = antTheme;
  return (
    <ConfigProvider
      theme={{
        ...finalTheme,
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <IntlProvider locale={locale} messages={messages[locale]}>
        <App>
          <Layout style={{ minHeight: "100vh", width: "100vw" }}>
            {children}
          </Layout>
        </App>
      </IntlProvider>
    </ConfigProvider>
  );
}
