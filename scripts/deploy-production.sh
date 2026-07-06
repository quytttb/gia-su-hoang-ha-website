#!/usr/bin/env bash
# Deploy PRODUCTION lên Vercel — cần xác nhận thủ công.
# Usage: ./scripts/deploy-production.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "⚠️  Deploy lên PRODUCTION (giasuhoangha.com)."
read -r -p "Gõ 'production' để tiếp tục: " CONFIRM
if [ "$CONFIRM" != "production" ]; then
  echo "Đã hủy."
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  log_error "Vercel CLI chưa cài. Chạy: npm i -g vercel"
  exit 1
fi

log_info "📦 Kiểm tra dependencies..."
[ -d "node_modules" ] || npm ci

log_info "🔍 ESLint..."
npm run lint

log_info "💄 Prettier..."
npm run format:check

log_info "🧪 Tests..."
npm run test:run

log_info "🔨 Build..."
npm run build

log_info "🚀 Deploy production..."
vercel --prod --yes

log_success "✅ Production deploy xong."
log_info "📝 https://giasuhoangha.com"
