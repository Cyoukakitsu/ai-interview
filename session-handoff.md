# Session Handoff

> 只在会话结束时有未完成的工作或阻塞时填写；没有就保持下面最近一次的内容。

## Current Objective

- Goal：建立 harness，并拆出 MVP 功能清单
- Current status：harness 已建立，功能清单已经用户确认
- Branch / commit：`chore/harness`

## Completed This Session

- [x] 生成并本地化 harness 文件
- [x] 按 README 拆出 feat-001 ～ feat-013

## Verification Evidence

| Check | Command | Result | Notes |
|---|---|---|---|
| 全量验证 | `./init.sh` | 通过 | install / build / lint / test |
| harness 结构评估 | `node .agents/skills/harness-creator/scripts/validate-harness.mjs --target .` | 见 PR | 只是结构性检查 |

## Files Changed

- `CLAUDE.md`、`feature_list.json`、`progress.md`、`session-handoff.md`、`init.sh`

## Decisions Made

- 根目录只用 `CLAUDE.md`（只用 Claude Code）；`apps/*` 下仍是 `CLAUDE.md` → `@AGENTS.md`
- 本项目的进度与交接统一用这套文件，不另用 harness-coach 的记录

## Blockers / Risks

- 系统提示词的文体与长度未定，会卡住 feat-007

## Next Session Startup

1. Read `CLAUDE.md`.
2. Read `feature_list.json` and `progress.md`.
3. Review this handoff.
4. Run `./init.sh` before editing.

## Recommended Next Step

- 从 feat-002（本地基础设施）或 feat-004（shared 里的 zod schema）开始
