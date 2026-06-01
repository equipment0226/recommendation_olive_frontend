import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 개발: /api → localhost:5000 프록시
// 프로덕션: VITE_API_BASE_URL 환경변수로 백엔드 도메인 지정
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
  build: {
    outDir: "dist",
  },
});
