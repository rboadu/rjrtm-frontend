import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy each endpoint prefix to the backend
      "/countries": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
      "/states": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
      "/cities": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});