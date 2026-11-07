import { Routing } from "./routing/Routing.tsx";
import { usePreferencesSync } from "./hooks/usePreferencesSync.ts";

export function App() {
  usePreferencesSync();
  return <Routing />;
}
