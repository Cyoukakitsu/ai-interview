import { defineConfig } from "@playwright/test";

// 浏览器 e2e：需要 Postgres（docker compose up -d）。不进 init.sh，和 api 的 test:e2e 一样单独跑
export default defineConfig({
  testDir: "./e2e",
  testMatch: "*.e2e.ts", // 不用 .spec/.test，避免被 vitest 当成单测
  use: { baseURL: "http://localhost:3000", channel: "chrome" }, // 用本机 Chrome，不下载浏览器
  webServer: [
    { command: "pnpm --filter @ai-interview/api dev", url: "http://localhost:3001", reuseExistingServer: true },
    { command: "pnpm --filter @ai-interview/web dev", url: "http://localhost:3000", reuseExistingServer: true },
  ],
});
