/**
 * Seed Supabase via REST API (service role) — works when direct Postgres port is blocked.
 * Run: node scripts/seed-supabase-api.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORT_DIR = path.join(__dirname, '..', 'data', 'firestore-export');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function loadJson(name) {
  const filePath = path.join(EXPORT_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function iso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function upsert(table, rows, onConflict = 'id') {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
}

const GALLERY_IMAGES = [
  '/images/real-photos/3d771690d24865163c59.jpg',
  '/images/real-photos/786448b78c6f3b31627e.jpg',
  '/images/real-photos/bf72059fc14776192f56.jpg',
  '/images/real-photos/37a0735db78500db5994.jpg',
  '/images/real-photos/e6bc4d52898a3ed4679b.jpg',
  '/images/real-photos/cf33f8c83c108b4ed201.jpg',
  '/images/real-photos/d7391421d0f967a73ee8.jpg',
  '/images/real-photos/0021e9c32d1b9a45c30a.jpg',
  '/images/real-photos/024a47b98361343f6d70.jpg',
  '/images/real-photos/fbf5ce260afebda0e4ef.jpg',
];

const SITE_ASSETS = [
  { key: 'tutor_search_teacher', url: '/images/gia-su-giao-vien.jpg', alt: 'Gia sư Giáo viên' },
  { key: 'tutor_search_student', url: '/images/gia-su-sinh-vien.jpg', alt: 'Gia sư Sinh viên' },
  { key: 'about_header', url: '/assets/images/gia-su-hoang-ha-header.jpg', alt: 'Gia Sư Hoàng Hà' },
  { key: 'about_founder', url: '/assets/images/founder.png', alt: 'Người sáng lập' },
];

async function main() {
  console.log('🌱 Seeding Supabase via REST API...\n');

  const users = loadJson('users').map(u => ({
    id: u.uid || u.id,
    email: u.email,
    name: u.name || u.email,
    role: ['admin', 'staff'].includes(u.role) ? u.role : 'user',
    phone: u.phone || null,
    avatar: u.avatar || null,
    isActive: u.isActive ?? true,
    createdAt: iso(u.createdAt),
    updatedAt: iso(u.updatedAt || u.createdAt),
    lastLogin: u.lastLogin ? iso(u.lastLogin) : null,
  }));
  await upsert('users', users);
  console.log(`✅ users: ${users.length}`);

  const classes = loadJson('classes').map(c => ({
    id: c.id,
    name: c.name || c.title || 'Lớp học',
    description: c.description || '',
    category: c.category || 'Khác',
    price: c.price ?? 0,
    discount: c.discount ?? 0,
    discountEndDate: c.discountEndDate || null,
    imageUrl: c.imageUrl || c.image || null,
    featured: c.featured ?? false,
    isActive: c.isActive ?? true,
    targetAudience: c.targetAudience || 'Học sinh',
    schedule: c.schedule || 'Linh hoạt',
    createdAt: iso(c.createdAt),
    updatedAt: iso(c.updatedAt || c.createdAt),
  }));
  await upsert('classes', classes);
  console.log(`✅ classes: ${classes.length}`);

  const tutors = loadJson('tutors').map(t => ({
    id: t.id,
    name: t.name,
    email: t.email || null,
    phone: t.phone || null,
    specialty: t.specialty || '',
    bio: t.bio || '',
    experience: t.experience || '',
    education: t.education || '',
    imageUrl: t.imageUrl || '',
    subjects: t.subjects || [],
    availability: t.availability || [],
    isActive: t.isActive ?? true,
    hourlyRate: t.hourlyRate ?? null,
    rating: t.rating ?? null,
    totalStudents: t.totalStudents ?? null,
    createdAt: iso(t.createdAt),
    updatedAt: iso(t.updatedAt || t.createdAt),
  }));
  await upsert('tutors', tutors);
  console.log(`✅ tutors: ${tutors.length}`);

  const classIds = new Set(classes.map(c => c.id));
  const tutorIds = new Set(tutors.map(t => t.id));

  const schedules = loadJson('schedules')
    .filter(s => classIds.has(s.classId) && tutorIds.has(s.tutorId))
    .map(s => ({
    id: s.id,
    classId: s.classId,
    className: s.className || '',
    tutorId: s.tutorId,
    tutorName: s.tutorName || '',
    startDate: iso(s.startDate),
    startTime: s.startTime || '08:00',
    endTime: s.endTime || '10:00',
    maxStudents: s.maxStudents ?? 12,
    studentPhones: s.studentPhones || [],
    status: s.status || 'scheduled',
    createdAt: iso(s.createdAt),
    updatedAt: iso(s.updatedAt || s.createdAt),
  }));
  await upsert('schedules', schedules);
  console.log(`✅ schedules: ${schedules.length}`);

  const registrations = loadJson('registrations').map(r => ({
    id: r.id,
    userId: r.userId || null,
    type: r.type || 'class',
    classId: r.classId || null,
    className: r.className || null,
    classSchedule: r.classSchedule || null,
    studentName: r.studentName || '',
    studentPhone: r.studentPhone || '',
    studentSchool: r.studentSchool || '',
    parentName: r.parentName || '',
    parentPhone: r.parentPhone || '',
    parentAddress: r.parentAddress || '',
    preferredSchedule: r.preferredSchedule || '',
    notes: r.notes || null,
    status: r.status || 'pending',
    approvedById: r.approvedBy || null,
    approvedByName: r.approvedByName || null,
    approvedAt: r.approvedAt ? iso(r.approvedAt) : null,
    rejectionReason: r.rejectionReason || null,
    tutorType: r.tutorType || null,
    tutorCriteria: r.tutorCriteria || null,
    matchedTutorId: r.matchedTutorId || null,
    matchedTutorName: r.matchedTutorName || null,
    matchedAt: r.matchedAt ? iso(r.matchedAt) : null,
    trialScheduledAt: r.trialScheduledAt ? iso(r.trialScheduledAt) : null,
    staffNotes: r.staffNotes || null,
    paymentStatus: r.paymentStatus || null,
    totalAmount: r.totalAmount ?? null,
    paidAmount: r.paidAmount ?? null,
    registrationDate: r.registrationDate ? iso(r.registrationDate) : r.createdAt ? iso(r.createdAt) : null,
    createdAt: iso(r.createdAt),
    updatedAt: iso(r.updatedAt || r.createdAt),
  }));
  await upsert('registrations', registrations);
  console.log(`✅ registrations: ${registrations.length}`);

  const banners = loadJson('banners').map(b => ({
    id: b.id,
    imageUrl: b.imageUrl,
    title: b.title || '',
    subtitle: b.subtitle || '',
    link: b.link || '',
    isActive: b.isActive ?? true,
    order: b.order ?? 0,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt || b.createdAt),
  }));
  await upsert('banners', banners);
  console.log(`✅ banners: ${banners.length}`);

  const blogPosts = loadJson('blogPosts').map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle || null,
    contentMarkdown: p.contentMarkdown || p.content || '',
    contentHtml: p.contentHtml || p.contentMarkdown || '',
    excerpt: p.excerpt || '',
    authorName: p.authorName || p.author || 'Admin',
    categoryId: p.categoryId || null,
    tags: p.tags || [],
    status: p.status || 'published',
    featured: p.featured ?? false,
    readTime: p.readTime ?? 1,
    viewCount: p.viewCount ?? 0,
    coverImageUrl: p.coverImage?.url || p.imageUrl || null,
    coverPublicId: p.coverImage?.publicId || null,
    seo: p.seo ?? {},
    publishedAt: p.publishedAt ? iso(p.publishedAt) : null,
    createdAt: iso(p.createdAt),
    updatedAt: iso(p.updatedAt || p.createdAt),
  }));
  await upsert('blog_posts', blogPosts);
  console.log(`✅ blog_posts: ${blogPosts.length}`);

  const contacts = loadJson('contacts').map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    message: c.message,
    status: ['read', 'replied', 'archived'].includes(c.status) ? c.status : 'new',
    userAgent: c.userAgent || null,
    createdAt: iso(c.createdAt),
    updatedAt: iso(c.updatedAt || c.createdAt),
  }));
  await upsert('contacts', contacts);
  console.log(`✅ contacts: ${contacts.length}`);

  const settings = loadJson('settings');
  if (settings[0]) {
    const center = settings[0];
    await upsert('center_info', [{
      id: 'center-info',
      name: center.name,
      description: center.description,
      address: center.address,
      phone: center.phone,
      email: center.email,
      history: center.history,
      mission: center.mission,
      vision: center.vision,
      slogan: center.slogan,
      workingHours: center.workingHours ?? { weekdays: '', weekend: '' },
      updatedAt: iso(center.updatedAt),
    }]);
    console.log('✅ center_info');
  }

  await supabase.from('gallery_images').delete().neq('id', '');
  const galleryRows = GALLERY_IMAGES.map((url, i) => ({
    id: randomUUID(),
    url,
    alt: `Hình thực tế ${i + 1}`,
    order: i + 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  await upsert('gallery_images', galleryRows);
  console.log(`✅ gallery_images: ${galleryRows.length}`);

  const now = new Date().toISOString();
  const assetRows = SITE_ASSETS.map(a => ({
    id: randomUUID(),
    key: a.key,
    url: a.url,
    alt: a.alt,
    label: null,
    updatedAt: now,
  }));
  await upsert('site_assets', assetRows, 'key');
  console.log(`✅ site_assets: ${assetRows.length}`);

  console.log('\n🎉 Seed complete!');
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
