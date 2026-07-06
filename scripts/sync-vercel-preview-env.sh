#!/usr/bin/env bash
# Đồng bộ env Supabase/Prisma lên Vercel PREVIEW (nhánh dev).
# Chỉ đọc từ .env local — không đụng production.
#
# Usage: ./scripts/sync-vercel-preview-env.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Không tìm thấy .env — copy từ .env.example và điền giá trị Supabase."
  exit 1
fi

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

# Build pooler URL cho Prisma trên serverless nếu chưa có
if [ -n "${DIRECT_URL:-}" ] && [[ "$DIRECT_URL" =~ postgresql://postgres:([^@]+)@db\.([^.]+)\.supabase\.co:5432/postgres ]]; then
  PG_PASS="${BASH_REMATCH[1]}"
  PG_REF="${BASH_REMATCH[2]}"
  if [ -z "${DATABASE_URL:-}" ] || [[ "$DATABASE_URL" == *"@db."*":5432"* ]]; then
    DATABASE_URL="postgresql://postgres.${PG_REF}:${PG_PASS}@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    echo "ℹ DATABASE_URL → Supabase pooler (port 6543)"
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
  printf '%s' "$value" | npx vercel env add "$name" preview --force >/dev/null
  echo "  ✓ $name → preview"
}

echo "🔧 Đồng bộ env lên Vercel PREVIEW (dev)..."

add_env NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
add_env NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
add_env SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"
add_env SUPABASE_URL "${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
add_env DATABASE_URL "$DATABASE_URL"
add_env DIRECT_URL "$DIRECT_URL"
add_env NEXT_PUBLIC_ENVIRONMENT "preview"
add_env NEXT_PUBLIC_APP_VERSION "${NEXT_PUBLIC_APP_VERSION:-0.2.0}"
add_env NEXT_PUBLIC_GA_TRACKING_ID "${NEXT_PUBLIC_GA_TRACKING_ID:-${VITE_GA_TRACKING_ID:-}}"
add_env NEXT_PUBLIC_EMAILJS_SERVICE_ID "${NEXT_PUBLIC_EMAILJS_SERVICE_ID:-${VITE_EMAILJS_SERVICE_ID:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT:-${VITE_EMAILJS_TEMPLATE_ID_CONTACT:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION:-${VITE_EMAILJS_TEMPLATE_ID_REGISTRATION:-}}"
add_env NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY "${NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTO_REPLY:-${VITE_EMAILJS_TEMPLATE_ID_AUTO_REPLY:-}}"
add_env NEXT_PUBLIC_EMAILJS_PUBLIC_KEY "${NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:-${VITE_EMAILJS_PUBLIC_KEY:-}}"

echo ""
echo "✅ Xong. Redeploy preview: npm run deploy:quick"
echo "   URL: https://gia-su-hoang-ha-client-git-dev-angelo-buis-projects.vercel.app"
