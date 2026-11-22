# Session Progress Log

## Current State

**Last Updated:** 2026-11-22
**Active Feature:** feat-002 本地基础设施（in-progress，分支 `feat/local-infra`，5 步做完 3 步）

## Status

### What's Done

- [x] feat-001 monorepo 骨架（PR #1 已合并）
- [x] 建立 harness：`CLAUDE.md`、`feature_list.json`、`progress.md`、`session-handoff.md`、`init.sh`

### What's In Progress

- feat-002 本地基础设施
  - [x] 1 `docker-compose.yml`：postgres:18 + redis:8，带 healthcheck，Postgres 数据存 named volume `pgdata`
  - [x] 2 根目录 `.env.example` / `.env`；compose 从 `.env` 读 `POSTGRES_*`
  - [x] 3 `apps/api` 接入 Prisma 7.10.1（`prisma7.config.ts` 读根 `.env`；build = `prisma generate && nest build`）
  - [ ] 4 `PrismaService` + `PrismaModule`；`main.ts` 读根 `.env`
  - [ ] 5 最小连接测试（放 `test/` 走 test:e2e，不进 `init.sh`，待用户确认）

### What's Next

1. 先给用户复习第 1～3 步（用户说 Docker 与 Prisma 文件还没太理解）
2. feat-002 第 4 步：PrismaService / PrismaModule
3. feat-002 第 5 步：连接测试

## Blockers / Risks

- [ ] 系统提示词的文体与长度未定（README「待定」）：会卡住 feat-007，要在那之前和用户定下来
- [ ] 第二步的 Web 搜索 API 未定：不影响 MVP
- [ ] 功能清单缺少部署功能（2026-11-22 发现）：README「技术方案」写部署用 `docker-compose.yml` 一键启动，但 feat-001～013 没有对应功能，api / web 也没有 Dockerfile。需要和用户确认后补一个功能（api、web 的 Dockerfile + compose 里用 `build:`）

## Decisions Made

- **TypeScript 统一为 6.x**：用 pnpm catalog 在根目录统一
  - Context：TS 7 是 Go 重写版，Nest CLI 与 Next 依赖 TS 的 JS 接口
  - Alternatives considered：各包各自版本（5.9 / 6.0 / 7.0），已放弃
- **删除 @nestjs/observe**：Nest 模板默认接入的第三方遥测，现阶段不需要
- **端口**：web 3000（Next 默认），api 3001
- **Prisma 固定 7.10.1**：npm 的 `latest` 指向 8.0.0 RC，RC 之间仍有破坏性改动
- **`.env` 只放根目录一份**：compose 与 api 共用；读取用 Node 自带 `process.loadEnvFile`，不装 dotenv
- **Postgres 18 而非 19**：19 于 2026-11-19 刚发布；18 的 volume 挂 `/var/lib/postgresql`（不是旧教程的 `/data`）
- **Redis 不挂 volume**：只放队列任务，丢了可重新生成
- **功能清单只拆到 MVP**：路线图后续阶段（企業別問答、企業情報ストック、ヒアリング、模擬面接）等 MVP 完成后再拆

## Files Modified This Session

- `docker-compose.yml`、`.env.example`（新）；`.gitignore` 加 `apps/api/src/generated/`
- `apps/api/package.json`：Prisma 依赖，build 先 generate
- `apps/api/prisma/schema.prisma`、`apps/api/prisma7.config.ts`（新）
- `pnpm-workspace.yaml`：`allowBuilds` 放行 `prisma`、`@prisma/engines`

## Evidence of Completion

- [x] `./init.sh`：install / build / lint / test 全部通过（2026-11-21）
- [x] `./init.sh` 通过（2026-11-22，feat-002 第 3 步后）

## Notes for Next Session

- 业务代码默认由用户亲手写，AI 负责讲解和 review（见 `CLAUDE.md`「协作方式」）
- 改了 `packages/shared` 要先构建它，api/web 才能看到改动
