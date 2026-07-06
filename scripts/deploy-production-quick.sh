#!/usr/bin/env bash
# Deploy nhanh PRODUCTION — cần xác nhận thủ công.
# Usage: ./scripts/deploy-production-quick.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "⚠️  Deploy nhanh lên PRODUCTION (giasuhoangha.com)."
read -r -p "Gõ 'production' để tiếp tục: " CONFIRM
if [ "$CONFIRM" != "production" ]; then
  echo "Đã hủy."
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI chưa cài."
  exit 1
fi

npm run build
vercel --prod --yes
echo -e "${GREEN}✅ Production deploy xong.${NC}"
