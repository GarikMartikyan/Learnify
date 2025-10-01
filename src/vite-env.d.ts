/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: "development" | "staging" | "production";
  readonly VITE_BASE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
