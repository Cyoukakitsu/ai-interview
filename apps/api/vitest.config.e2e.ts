import { defineConfig } from 'vitest/config';

// 测试不走 main.ts，这里单独加载根 .env；配置在主进程执行，worker 会继承 process.env
process.loadEnvFile(new URL('../../.env', import.meta.url));

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
