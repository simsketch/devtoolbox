import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries (exact match to avoid react-* packages)
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }

          // CodeMirror packages
          if (id.includes("node_modules/@codemirror")) {
            return "vendor-codemirror";
          }

          // React Flow (pipeline builder)
          if (id.includes("node_modules/@xyflow/react")) {
            return "vendor-flow";
          }

          // UI libraries
          if (
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/@radix-ui")
          ) {
            return "vendor-ui";
          }

          // Markdown and diff viewer libraries
          if (
            id.includes("node_modules/react-markdown") ||
            id.includes("node_modules/remark-gfm") ||
            id.includes("node_modules/react-diff-viewer-continued")
          ) {
            return "vendor-markdown";
          }

          // All other node_modules go into a general vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // App code stays in the default chunk
          // (no return statement means it goes to the main bundle)
        },
      },
    },
  },
}));
