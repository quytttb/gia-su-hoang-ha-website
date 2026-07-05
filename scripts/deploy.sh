#!/bin/bash

# Deploy Next.js app lên Vercel
# Sử dụng: ./scripts/deploy.sh [--production]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if ! command -v vercel &> /dev/null; then
    log_error "Vercel CLI chưa được cài đặt. Vui lòng cài đặt bằng: npm i -g vercel"
    exit 1
fi

if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ]; then
    log_error "Script này phải được chạy từ thư mục root của dự án Next.js"
    exit 1
fi

log_info "🚀 Bắt đầu quá trình deploy lên Vercel..."

PRODUCTION_FLAG=""
if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
    PRODUCTION_FLAG="--prod"
    log_info "📦 Deploy lên môi trường PRODUCTION"
else
    log_info "🧪 Deploy lên môi trường PREVIEW"
fi

log_info "📦 Kiểm tra dependencies..."
if [ ! -d "node_modules" ]; then
    log_info "Cài đặt dependencies..."
    npm ci
else
    log_info "Dependencies đã được cài đặt"
fi

log_info "🔍 Chạy ESLint..."
npm run lint

log_info "💄 Kiểm tra code formatting..."
npm run format:check

log_info "🧪 Chạy tests..."
npm run test:run

log_info "🔨 Build Next.js app..."
npm run build

log_info "🚀 Deploy lên Vercel..."
if [ -n "$PRODUCTION_FLAG" ]; then
    vercel --prod --yes
else
    vercel --yes
fi

log_success "✅ Deploy thành công!"

if [ -n "$PRODUCTION_FLAG" ]; then
    log_success "🌐 Ứng dụng đã được deploy lên production"
    log_info "📝 Kiểm tra tại: https://giasuhoangha.com"
else
    log_success "🌐 Ứng dụng đã được deploy lên preview"
    log_info "📝 URL preview sẽ được hiển thị ở trên"
fi

log_info "🎉 Hoàn thành!"
