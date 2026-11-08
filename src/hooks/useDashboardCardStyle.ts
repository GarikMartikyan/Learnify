import type { CSSProperties } from "react";
import { theme } from "antd";

/** The card look shared by every dashboard (admin, teacher, student). */
export function useDashboardCardStyle(): CSSProperties {
  const { token } = theme.useToken();
  return { height: "100%", borderRadius: 16, boxShadow: token.boxShadowTertiary };
}
