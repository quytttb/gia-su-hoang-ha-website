#!/usr/bin/env bash
# Đồng bộ env lên Vercel PRODUCTION — chỉ chạy khi sẵn sàng lên main.
# Cần xác nhận thủ công. Không dùng trong quy trình dev hàng ngày.
#
# Usage: ./scripts/sync-vercel-production-env.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

echo "⚠️  Script này ghi env lên Vercel PRODUCTION (giasuhoangha.com)."
echo "    Chỉ chạy sau khi đã test kỹ trên preview/dev."
echo ""
read -r -p "Gõ 'production' để tiếp tục: " CONFIRM
if [ "$CONFIRM" != "production" ]; then
  echo "Đã hủy."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Không tìm thấy .env"
  exit 1
fi

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

if [ -n "${DIRECT_URL:-}" ] && [[ "$DIRECT_URL" =~ postgresql://postgres:([^@]+)@db\.([^.]+)\.supabase\.co:5432/postgres ]]; then
  PG_PASS="${BASH_REMATCH[1]}"
  PG_REF="${BASH_REMATCH[2]}"
  if [ -z "${DATABASE_URL:-}" ] || [[ "$DATABASE_URL" == *"@db."*":5432"* ]]; then
    DATABASE_URL="postgresql://postgres.${PG_REF}:${PG_PASS}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  fi
fi

[ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ] || NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL:-}"
[ -n "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" ] || NEXT_PUBLIC_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}"

add_env() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "  ⚠ Bỏ qua $name: trống"
    return
  fi
  printf '%s' "$value" | npx vercel env add "$name" production --force >/dev/null
  echo "  ✓ $name → production"
}

echo ""
echo "🔧 Đồng bộ env lên Vercel PRODUCTION..."

add_env NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
add_env NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
add_env SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"
add_env SUPABASE_URL "${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
add_env DATABASE_URL "$DATABASE_URL"
add_env DIRECT_URL "$DIRECT_URL"
add_env NEXT_PUBLIC_ENVIRONMENT "production"
add_env NEXT_PUBLIC_APP_VERSION "${NEXT_PUBLIC_APP_VERSION:-0.2.0}"
add_env NEXT_PUBLIC_GA_TRACKING_ID "${NEXT_PUBLIC_GA_TRACKING_ID:-${VITE_GA_TRACKING_ID:-}}"
add_env NEXT_PUBLIC_EMAILJS_SERVICE_ID "${NEXT_PUBLIC_EMAILJS_SERVICE_ID:-${VITE_EMAILJS_SERVICE_ID:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT:-${VITE_EMAILJS_TEMPLATE_ID_CONTACT:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION:-${VITE_EMAILJS_TEMPLATE_ID_REGISTRATION:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY:-${VITE_EMAILJS_TEMPLATE_ID_AUTO_REPLY:-}}"
add_env NEXT_PUBLIC_EMAILJS_PUBLIC_KEY "${NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:-${VITE_EMAILJS_PUBLIC_KEY:-}}"

echo ""
echo "✅ Xong. Deploy production: npm run deploy:prod"
