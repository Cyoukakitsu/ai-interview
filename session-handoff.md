# Session Handoff

> 只在会话结束时有未完成的工作或阻塞时填写；没有就保持下面最近一次的内容。

## Current Objective

- Goal：feat-002 本地基础设施
- Current status：feat-002 五步全部完成，已标 done，待提交 / PR
- Branch / commit：`feat/local-infra`

## Completed This Session

- [x] 1 `docker-compose.yml`（postgres:18、redis:8、healthcheck、`pgdata` volume）
- [x] 2 `.env.example` / `.env`（根目录一份），compose 读 `${POSTGRES_*}`
- [x] 3 Prisma 7.10.1 接入：`prisma7.config.ts` 读根 `.env`，build 先 `prisma generate`

## Verification Evidence

| Check | Command | Result | Notes |
|---|---|---|---|
| 容器 | `docker compose ps` | postgres / redis 均 healthy | |
| Postgres | `docker compose exec postgres psql ... -c "select 1"` | 返回 1 | 用的是 `DATABASE_URL` 同一串 |
| Redis | `docker compose exec redis redis-cli ping` | PONG | |
| .env 忽略 | `git check-ignore -v .env` | `.gitignore:2` | |
| Prisma 连库 | `pnpm exec prisma migrate status`（apps/api） | 连上，无 migration | |
| 干净构建 | `rm -rf src/generated dist && pnpm build` | 通过 | |
| 全量 | `./init.sh` | 通过 | |

## Decisions Made

- Prisma 固定 7.10.1（`latest` 是 8 RC）；`.env` 只放根目录；不装 dotenv，用 `process.loadEnvFile`
- `prisma init` 自动装的 AI skills（`.claude/.windsurf/.agents/skills-lock.json`）和 `apps/api/.env`、`apps/api/.gitignore` 已删除

## Blockers / Risks

- 用户反馈 Docker 与 Prisma 文件的写法还没太理解：下次先复习，再写新代码
- 已验证（2026-11-23）：adapter 模式下 `$connect()` 不真连库，停库后 api 照常启动；改成 `$queryRaw SELECT 1` 后停库启动报 ECONNREFUSED
- 连接测试放 `test/`（test:e2e，不进 `init.sh`）是建议，尚待用户确认

## Next Session Startup

1. Read `CLAUDE.md`.
2. Read `feature_list.json` and `progress.md`.
3. Review this handoff.
4. `docker compose up -d`，再跑 `./init.sh`.

## Recommended Next Step

- 提交 feat-002 并开 PR；然后和用户确认下一个功能
- 小改：`apps/api/prisma7.config.ts` 把 `process.loadEnvFile(...)` 挪到 `import` 下面
