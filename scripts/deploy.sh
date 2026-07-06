#!/usr/bin/env bash
# Deploy PREVIEW lên Vercel (nhánh dev, không đụng production).
# Usage: ./scripts/deploy.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "${1:-}" = "--production" ] || [ "${1:-}" = "-p" ]; then
  log_error "Script này chỉ deploy PREVIEW."
  log_error "Để lên production, dùng: npm run deploy:prod"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  log_error "Vercel CLI chưa cài. Chạy: npm i -g vercel"
  exit 1
fi

if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ]; then
  log_error "Chạy script từ thư mục root của dự án."
  exit 1
fi

log_info "🧪 Deploy PREVIEW (dev) lên Vercel..."

log_info "📦 Kiểm tra dependencies..."
if [ ! -d "node_modules" ]; then
  npm ci
fi

log_info "🔍 ESLint..."
npm run lint

log_info "💄 Prettier..."
npm run format:check

log_info "🧪 Tests..."
npm run test:run

log_info "🔨 Build..."
npm run build

log_info "🚀 Deploy preview..."
vercel --yes

log_success "✅ Preview deploy xong."
log_info "📝 https://gia-su-hoang-ha-client-git-dev-angelo-buis-projects.vercel.app"
