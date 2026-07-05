#!/bin/bash

# Deploy nhanh Next.js app lên Vercel (bỏ qua lint/test)
# Sử dụng: ./scripts/deploy-quick.sh [--production]

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt. Vui lòng cài đặt bằng: npm i -g vercel"
    exit 1
fi

if [ ! -f "next.config.ts" ]; then
    echo "❌ Không tìm thấy next.config.ts. Hãy chạy script từ thư mục root của dự án."
    exit 1
fi

log_info "⚡ Deploy nhanh lên Vercel..."

PRODUCTION_FLAG=""
if [ "${1:-}" = "--production" ] || [ "${1:-}" = "-p" ]; then
    PRODUCTION_FLAG="--prod"
    log_info "📦 Deploy lên PRODUCTION"
else
    log_info "🧪 Deploy lên PREVIEW"
fi

log_info "🔨 Build Next.js app..."
npm run build

log_info "🚀 Deploy..."
if [ -n "$PRODUCTION_FLAG" ]; then
    vercel --prod --yes
else
    vercel --yes
fi

log_success "✅ Deploy thành công!"
