#!/usr/bin/env bash
# Installs a daily cron job that refreshes AI News Hub data at 07:00
# (completes well before 09:00).
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$(command -v node)"
LOG="$PROJECT_DIR/data/fetch.log"

CRON_LINE="0 7 * * * cd \"$PROJECT_DIR\" && \"$NODE_BIN\" scripts/fetch-data.mjs >> \"$LOG\" 2>&1"

# Remove any prior entry for this script, then append the fresh one.
EXISTING="$(crontab -l 2>/dev/null | grep -v 'fetch-data.mjs' || true)"
printf '%s\n%s\n' "$EXISTING" "$CRON_LINE" | grep -v '^$' | crontab -

echo "✓ 已安装每日 07:00 自动更新任务（9 点前完成）："
echo "  $CRON_LINE"
echo "查看：crontab -l    日志：$LOG"
