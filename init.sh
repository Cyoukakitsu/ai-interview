#!/bin/bash
set -e

echo "=== pnpm install ==="
pnpm install

echo "=== pnpm build ==="
pnpm build

echo "=== pnpm -r run lint ==="
pnpm -r run lint

echo "=== pnpm test ==="
pnpm test

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. 读 feature_list.json，确认当前功能"
echo "2. 一次只做一个功能"
echo "3. 声称完成前重新跑 ./init.sh"
