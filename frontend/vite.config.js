import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, "..", "");

  return {
    envDir: "..",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
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
