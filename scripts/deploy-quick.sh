#!/usr/bin/env bash
# Deploy nhanh PREVIEW (bỏ lint/test).
# Usage: ./scripts/deploy-quick.sh

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

if [ "${1:-}" = "--production" ] || [ "${1:-}" = "-p" ]; then
  echo -e "${RED}[ERROR]${NC} Script này chỉ deploy PREVIEW. Dùng: npm run deploy:quick:prod"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI chưa cài. Chạy: npm i -g vercel"
  exit 1
fi

if [ ! -f "next.config.ts" ]; then
  echo "❌ Chạy từ thư mục root."
  exit 1
fi

echo -e "${BLUE}[INFO]${NC} ⚡ Deploy nhanh PREVIEW..."
npm run build
vercel --yes
echo -e "${GREEN}[SUCCESS]${NC} ✅ Preview deploy xong."
