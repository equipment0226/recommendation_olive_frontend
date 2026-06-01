import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Flask API(5000)로 /api 프록시. 프론트는 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
