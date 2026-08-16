/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DEMO_TOOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
