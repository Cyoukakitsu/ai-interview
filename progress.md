# Session Progress Log

## Current State

**Last Updated:** 2026-11-21
**Active Feature:** 无（feat-001 已完成，下一个候选：feat-002 本地基础设施）

## Status

### What's Done

- [x] feat-001 monorepo 骨架（PR #1 已合并）
- [x] 建立 harness：`CLAUDE.md`、`feature_list.json`、`progress.md`、`session-handoff.md`、`init.sh`

### What's In Progress

- 无（功能清单已经用户确认）

### What's Next

1. 开始 feat-002（docker-compose + Prisma），或先做不依赖数据库的 feat-004（shared 里的 zod schema）

## Blockers / Risks

- [ ] 系统提示词的文体与长度未定（README「待定」）：会卡住 feat-007，要在那之前和用户定下来
- [ ] 第二步的 Web 搜索 API 未定：不影响 MVP

## Decisions Made

- **TypeScript 统一为 6.x**：用 pnpm catalog 在根目录统一
  - Context：TS 7 是 Go 重写版，Nest CLI 与 Next 依赖 TS 的 JS 接口
  - Alternatives considered：各包各自版本（5.9 / 6.0 / 7.0），已放弃
- **删除 @nestjs/observe**：Nest 模板默认接入的第三方遥测，现阶段不需要
- **端口**：web 3000（Next 默认），api 3001
- **功能清单只拆到 MVP**：路线图后续阶段（企業別問答、企業情報ストック、ヒアリング、模擬面接）等 MVP 完成后再拆

## Files Modified This Session

- `CLAUDE.md`、`feature_list.json`、`progress.md`、`session-handoff.md`、`init.sh`：新建 harness

## Evidence of Completion

- [x] `./init.sh`：install / build / lint / test 全部通过（2026-11-21）

## Notes for Next Session

- 业务代码默认由用户亲手写，AI 负责讲解和 review（见 `CLAUDE.md`「协作方式」）
- 改了 `packages/shared` 要先构建它，api/web 才能看到改动
