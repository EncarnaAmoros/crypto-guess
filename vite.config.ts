import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "~/": `${path.resolve("src")}/`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts",
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
  define:
    mode === "test"
      ? {
          "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
            "http://mocksupabaseurl"
          ),
          "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
            "mocksupabaseanonkey"
          ),
        }
      : {},
}));
