# Session Progress Log

## Current State

**Last Updated:** 2026-11-26
**Active Feature:** 无（feat-003 PR #5 待合并；feat-005 已 done，待提交 / PR；下一个候选 feat-006）

## Status

### What's Done

- [x] feat-001 monorepo 骨架（PR #1 已合并）
- [x] feat-002 本地基础设施（PR #3 已合并）
- [x] feat-004 想定問答的 zod schema（`packages/shared/src/qa.ts`；判别联合 ok / needs-confirmation；web 与 shared 新增 vitest）
- [x] feat-003 数据模型（Applicant / CareerDocument / InterviewQa；默认求職者用固定 id + skipDuplicates）
- [x] feat-005 職務経歴書上传与解析（api：`POST /career-documents`、`/career-documents/upload`；web：上传页，引入 shadcn/ui 与 Playwright e2e）
- [x] 建立 harness：`CLAUDE.md`、`feature_list.json`、`progress.md`、`session-handoff.md`、`init.sh`

### What's In Progress

- feat-002 本地基础设施
  - [x] 1 `docker-compose.yml`：postgres:18 + redis:8，带 healthcheck，Postgres 数据存 named volume `pgdata`
  - [x] 2 根目录 `.env.example` / `.env`；compose 从 `.env` 读 `POSTGRES_*`
  - [x] 3 `apps/api` 接入 Prisma 7.10.1（`prisma7.config.ts` 读根 `.env`；build = `prisma generate && nest build`）
  - [x] 4 `PrismaService` + `PrismaModule`；`main.ts` 读根 `.env`（`onModuleInit` 用 `$queryRaw SELECT 1`，因 `$connect()` 在 adapter 模式下是懒连接）
  - [x] 5 最小连接测试（`test/prisma.e2e-spec.ts`，走 test:e2e，不进 `init.sh`；`vitest.config.e2e.ts` 加载根 `.env`）

### What's Next

1. feat-003（PR #5）合并后，feat-005 的 PR（分支 `feat/resume-ingest`，从 `feat/data-model` 切出）再合并
2. 和用户确认下一个功能（feat-006 多厂商；feat-007 要等 006）
3. feat-007 入库时要映射枚举：zod 的 `deep-dive` / `needs-confirmation` ↔ Prisma 的 `deep_dive` / `needs_confirmation`
3. 第 1～3 步（Docker 与 Prisma 文件）用户说还没太理解，有空再复习

## Blockers / Risks

- [ ] 超出 feat-005 范围、未做：OCR（扫描版 PDF 目前只提示改为粘贴）、旧版 `.doc`、病毒扫描、加密 PDF 的专门提示（现在与损坏 PDF 同为 400）、PDF 硬换行不合并（feat-008 比对时要忽略空白与换行）
- [ ] 界面语言未定（README 没写），web 目前用日语，待用户确认

- [ ] 系统提示词的文体与长度未定（README「待定」）：会卡住 feat-007，要在那之前和用户定下来
- [ ] 第二步的 Web 搜索 API 未定：不影响 MVP
- [ ] 功能清单缺少部署功能（2026-11-22 发现）：README「技术方案」写部署用 `docker-compose.yml` 一键启动，但 feat-001～013 没有对应功能，api / web 也没有 Dockerfile。需要和用户确认后补一个功能（api、web 的 Dockerfile + compose 里用 `build:`）

## Decisions Made

- **职务经历书文本入库前统一规范化**（`apps/api/src/resume/normalize-text.ts`）：NFKC + 去日文字符间空格 + 统一换行。原因：PDF 抽出的是康熙部首字符（⼭⽥），不规范化的话 feat-008 的根拠字符串匹配会永远对不上
- **上传大小**：文件 5MB；文本 30,000 字（日文每字 3 字节，须在 Express 默认 100KB 请求体内，否则会先被框架 413 拦下）
- **校验管道**：`APP_PIPE` 全局注册 `StandardSchemaValidationPipe`；`@Body({ schema })` 单写不会校验
- **默认求職者**：固定 id + `createMany skipDuplicates`；Prisma `upsert` 是先查后插，并发会撞主键
- **web 界面暂用日语**（README 未定界面语言，待用户确认）；暂未引入 TanStack Query（目前只有一次提交，有列表 / SSE 进度时再接）

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
- 跑 api `test:e2e` 与 web `test:e2e` 前，样本不在 git 里，先执行 `apps/api/test/fixtures/make-fixtures.sh`（需要 macOS + Chrome）；两个 e2e 都需要 `docker compose up -d`
