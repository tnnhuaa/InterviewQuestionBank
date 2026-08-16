import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, "..", "");

  return {
    envDir: "..",
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: environment.VITE_DEV_API_TARGET || "http://127.0.0.1:3000",
          changeOrigin: true,
        },
      },
    },
    test: { environment: "node" },
  };
});
