import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/tasks": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/execution-plan": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});