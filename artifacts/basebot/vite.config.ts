import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

const isReplit = process.env.REPL_ID !== undefined;

async function getReplitPlugins() {
  if (!isReplit) return [];
  try {
    const plugins = [];
    const runtimeErrorModal = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorModal.default());
    if (process.env.NODE_ENV !== "production") {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(
        cartographer.cartographer({
          root: path.resolve(import.meta.dirname, ".."),
        }),
      );
      const devBanner = await import("@replit/vite-plugin-dev-banner");
      plugins.push(devBanner.devBanner());
    }
    return plugins;
  } catch {
    return [];
  }
}

export default defineConfig(async () => ({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...(await getReplitPlugins()),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-query", "wagmi", "viem", "@wagmi/core"],
  },
  optimizeDeps: {
    include: ["wagmi", "viem", "@wagmi/core", "@tanstack/react-query"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
}));
