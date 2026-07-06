# Gia Sư Hoàng Hà — Website

Website chính thức của Trung tâm Gia Sư Hoàng Hà (Thanh Hóa).

**Production:** https://giasuhoangha.com  
**Preview (nhánh `dev`):** https://gia-su-hoang-ha-client-git-dev-angelo-buis-projects.vercel.app

## Tech stack

| Layer    | Công nghệ                                           |
| -------- | --------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 18, TypeScript       |
| UI       | Tailwind CSS v4, Shadcn/ui, TanStack Query, Zustand |
| Backend  | Supabase (PostgreSQL, Auth, Storage)                |
| ORM      | Prisma 6                                            |
| Deploy   | Vercel                                              |
| Email    | EmailJS                                             |

## Cài đặt local

```bash
git clone <repository-url>
cd gia-su-hoang-ha-website
npm install
cp .env.example .env   # điền Supabase, EmailJS, GA
npm run dev            # http://localhost:3000
```

### Biến môi trường chính

Xem `.env.example`. Cần tối thiểu:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (upload ảnh panel, server actions)
- `DATABASE_URL` (pooler port 6543 trên Vercel), `DIRECT_URL` (port 5432 cho migrate local)
- `NEXT_PUBLIC_EMAILJS_*`, `NEXT_PUBLIC_GA_TRACKING_ID`

## Scripts

### Development

```bash
npm run dev              # Dev server
npm run build            # prisma generate + next build
npm run lint             # ESLint
npm run test:run         # Vitest
```

### Database (Supabase)

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Migrate schema (local)
npm run prisma:studio    # GUI xem DB
npm run seed:supabase    # Seed qua REST API
npm run migrate:images   # Upload ảnh export → Supabase Storage
```

### Deploy

| Lệnh                       | Môi trường     | Ghi chú                      |
| -------------------------- | -------------- | ---------------------------- |
| `npm run env:sync:preview` | Vercel Preview | Đồng bộ env từ `.env` local  |
| `npm run deploy`           | Preview        | Lint + test + build + deploy |
| `npm run deploy:quick`     | Preview        | Build + deploy (nhanh)       |
| `npm run env:sync:prod`    | Production     | Cần gõ `production`          |
| `npm run deploy:prod`      | Production     | Cần gõ `production`          |

> Nhánh `dev` → auto-deploy **preview** trên Vercel.  
> Nhánh `master`/`main` → production (`giasuhoangha.com`) — chỉ merge khi đã test kỹ preview.

## Cấu trúc thư mục

```
prisma/           # Schema + seed
src/
  app/            # Next.js App Router pages
  actions/        # Server actions (mutations)
  data/           # Server data layer (reads)
  components/     # React components
  hooks/          # TanStack Query hooks
  lib/            # prisma, supabase, env, utils
  services/       # auth, email
scripts/          # deploy, seed, migrate, test-seo
public/           # Static assets
```

## CI

GitHub Actions (`CI` workflow) chạy trên push/PR vào `dev`:

- `prisma validate` → lint → format → test → build

## Liên hệ

- Địa chỉ: 265 - Đường 06, Phường Nam Ngạn, Thanh Hóa
- Điện thoại: 0385.510.892 - 0962.390.161
- Email: lienhe@giasuhoangha.com
- Facebook: https://www.facebook.com/profile.php?id=61575087818708
