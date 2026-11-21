# CLAUDE.md

ai-interview：面向日本中途採用求職者的 AI 面接対策エージェント。产品规则与技术方案见 `README.md`，术语见 `CONTEXT.md`（代码、注释、提交信息里的业务名词一律用其中的术语）。

## Startup Workflow

Before writing code:

1. 读完本文件
2. 读 `feature_list.json`，找到 `in-progress` 的功能；没有就挑一个依赖都已 `done` 的 `not-started` 功能，并和用户确认
3. 读 `progress.md` 和 `session-handoff.md`，接上次的进度
4. `git log --oneline -5` 看最近提交
5. 跑 `./init.sh`；基线不通过就先修基线，不加新功能

## 仓库结构

| 位置 | 内容 | 端口 |
|---|---|---|
| `apps/api` | NestJS 12（ESM、Vitest）。规则见 `apps/api/AGENTS.md` | 3001 |
| `apps/web` | Next.js 16（App Router、`src/`、Tailwind、`@/*`）。规则见 `apps/web/AGENTS.md` | 3000 |
| `packages/shared` | zod schema 与类型，tsc 编译到 `dist/`，api/web 用 `workspace:*` 引用 | — |

- 包管理只用 pnpm；临时执行包用 `pnpm dlx`，不用 `npx`（根 `devEngines` 会拦下 npm）
- TypeScript 版本只在根 `pnpm-workspace.yaml` 的 `catalog` 里改；各包写 `"typescript": "catalog:"`
- 前后端共用的数据结构放 `packages/shared`，改了它要先 `pnpm --filter @ai-interview/shared build`

## Working Rules

- **One feature at a time**：一次只做 `feature_list.json` 里的一个功能，开始时把它改成 `in-progress`
- **Stay in scope**：不改与当前功能无关的文件；发现别的问题记进 `progress.md`，不顺手修
- **协作方式**：业务代码默认由用户亲手写，AI 负责讲解、拆步骤和 review；用户明确说「帮我做 / 你来写」时才直接改代码
- **产品规则不可违反**：回答绝不编造，必须带根拠；信息不足标为要確認（详见 `README.md`「产品规则」）
- **Verification required**：没跑验证不能说「完成」

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] 该功能 `acceptance` 里的每一条都满足
- [ ] `./init.sh` 全部通过（install / build / lint / test）
- [ ] 新增或改动的行为有对应测试（只测改动的行为，不铺大而全的 e2e）
- [ ] Evidence（命令与结果）写进 `feature_list.json` 的 `evidence`，状态改为 `done`
- [ ] 仓库保持 clean、restartable：下个会话能直接跑 `./init.sh`

## End of Session

Before ending a session:

1. 更新 `progress.md`（Current State、做了什么、Next）
2. 更新 `feature_list.json` 的 `status` / `evidence`
3. 有未完成的工作或阻塞时，填写 `session-handoff.md`
4. 在安全状态下提交（在功能分支上，不直接提交到 `main`）

## Verification Commands

```bash
./init.sh
```

依次执行：`pnpm install` → `pnpm build`（shared 先构建）→ `pnpm -r run lint` → `pnpm test`。

## Escalation

- 架构或技术选型：以 `README.md`「技术方案」为准，没写的问用户
- 需求不清：以 `README.md` 与 `CONTEXT.md` 为准，`README.md`「待定」里的事项必须问用户，不要自己定
- 同一个测试反复失败：记进 `progress.md`，交给用户判断
