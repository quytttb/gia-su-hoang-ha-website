/**
 * Seed PostgreSQL from exported Firestore JSON + hardcoded gallery/site assets.
 * Run: npx tsx prisma/seed.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PrismaClient,
  UserRole,
  RegistrationStatus,
  RegistrationType,
  ScheduleStatus,
  BlogPostStatus,
  ContactStatus,
} from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORT_DIR = path.join(__dirname, '..', 'data', 'firestore-export');
const prisma = new PrismaClient();

function loadJson<T>(name: string): T[] {
  const filePath = path.join(EXPORT_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T[];
}

function parseDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function mapContactStatus(status: string): ContactStatus {
  if (status === 'read' || status === 'replied' || status === 'archived') return status;
  return 'new';
}

function mapRegistrationType(type?: string): RegistrationType {
  if (type === 'tutor_teacher' || type === 'tutor_student') return type;
  return 'class';
}

function mapRegistrationStatus(status?: string): RegistrationStatus {
  const allowed: RegistrationStatus[] = [
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'completed',
    'matched',
    'trial_scheduled',
  ];
  return allowed.includes(status as RegistrationStatus)
    ? (status as RegistrationStatus)
    : 'pending';
}

function mapScheduleStatus(status?: string): ScheduleStatus {
  const allowed: ScheduleStatus[] = ['scheduled', 'ongoing', 'completed', 'cancelled'];
  return allowed.includes(status as ScheduleStatus) ? (status as ScheduleStatus) : 'scheduled';
}

function mapUserRole(role?: string): UserRole {
  if (role === 'admin' || role === 'staff') return role;
  return 'user';
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
  console.log('🌱 Seeding from Firestore export...\n');

  const users = loadJson<any>('users');
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.uid || u.id },
      create: {
        id: u.uid || u.id,
        email: u.email,
        name: u.name || u.email,
        role: mapUserRole(u.role),
        phone: u.phone,
        avatar: u.avatar,
        isActive: u.isActive ?? true,
        createdAt: parseDate(u.createdAt) ?? new Date(),
        lastLogin: parseDate(u.lastLogin),
      },
      update: {
        email: u.email,
        name: u.name || u.email,
        role: mapUserRole(u.role),
        lastLogin: parseDate(u.lastLogin),
      },
    });
  }
  console.log(`✅ users: ${users.length}`);

  const classes = loadJson<any>('classes');
  for (const c of classes) {
    await prisma.class.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name || c.title || 'Lớp học',
        description: c.description || '',
        category: c.category || 'Khác',
        price: c.price ?? 0,
        discount: c.discount ?? 0,
        discountEndDate: c.discountEndDate || null,
        imageUrl: c.imageUrl || c.image,
        featured: c.featured ?? false,
        isActive: c.isActive ?? true,
        targetAudience: c.targetAudience || 'Học sinh',
        schedule: c.schedule || 'Linh hoạt',
        createdAt: parseDate(c.createdAt) ?? new Date(),
        updatedAt: parseDate(c.updatedAt) ?? new Date(),
      },
      update: {
        name: c.name || c.title || 'Lớp học',
        description: c.description || '',
        imageUrl: c.imageUrl || c.image,
        isActive: c.isActive ?? true,
        updatedAt: parseDate(c.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ classes: ${classes.length}`);

  const tutors = loadJson<any>('tutors');
  for (const t of tutors) {
    await prisma.tutor.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        specialty: t.specialty || '',
        bio: t.bio || '',
        experience: t.experience || '',
        education: t.education || '',
        imageUrl: t.imageUrl || '',
        subjects: t.subjects || [],
        availability: t.availability || [],
        isActive: t.isActive ?? true,
        hourlyRate: t.hourlyRate,
        rating: t.rating,
        totalStudents: t.totalStudents,
        createdAt: parseDate(t.createdAt) ?? new Date(),
        updatedAt: parseDate(t.updatedAt) ?? new Date(),
      },
      update: {
        name: t.name,
        imageUrl: t.imageUrl || '',
        isActive: t.isActive ?? true,
        updatedAt: parseDate(t.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ tutors: ${tutors.length}`);

  const schedules = loadJson<any>('schedules');
  for (const s of schedules) {
    await prisma.schedule.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        classId: s.classId,
        className: s.className || '',
        tutorId: s.tutorId,
        tutorName: s.tutorName || '',
        startDate: parseDate(s.startDate) ?? new Date(),
        startTime: s.startTime || '08:00',
        endTime: s.endTime || '10:00',
        maxStudents: s.maxStudents ?? 12,
        studentPhones: s.studentPhones || [],
        status: mapScheduleStatus(s.status),
        createdAt: parseDate(s.createdAt) ?? new Date(),
        updatedAt: parseDate(s.updatedAt) ?? new Date(),
      },
      update: {
        className: s.className || '',
        tutorName: s.tutorName || '',
        status: mapScheduleStatus(s.status),
        updatedAt: parseDate(s.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ schedules: ${schedules.length}`);

  const registrations = loadJson<any>('registrations');
  for (const r of registrations) {
    await prisma.registration.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        userId: r.userId,
        type: mapRegistrationType(r.type),
        classId: r.classId,
        className: r.className,
        classSchedule: r.classSchedule,
        studentName: r.studentName || '',
        studentPhone: r.studentPhone || '',
        studentSchool: r.studentSchool || '',
        parentName: r.parentName || '',
        parentPhone: r.parentPhone || '',
        parentAddress: r.parentAddress || '',
        preferredSchedule: r.preferredSchedule || '',
        notes: r.notes,
        status: mapRegistrationStatus(r.status),
        approvedById: r.approvedBy,
        approvedByName: r.approvedByName,
        approvedAt: parseDate(r.approvedAt),
        rejectionReason: r.rejectionReason,
        tutorType: r.tutorType,
        tutorCriteria: r.tutorCriteria,
        matchedTutorId: r.matchedTutorId,
        matchedTutorName: r.matchedTutorName,
        matchedAt: parseDate(r.matchedAt),
        trialScheduledAt: parseDate(r.trialScheduledAt),
        staffNotes: r.staffNotes,
        paymentStatus: r.paymentStatus,
        totalAmount: r.totalAmount,
        paidAmount: r.paidAmount,
        registrationDate: parseDate(r.registrationDate || r.createdAt),
        createdAt: parseDate(r.createdAt) ?? new Date(),
        updatedAt: parseDate(r.updatedAt) ?? new Date(),
      },
      update: {
        status: mapRegistrationStatus(r.status),
        updatedAt: parseDate(r.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ registrations: ${registrations.length}`);

  const banners = loadJson<any>('banners');
  for (const b of banners) {
    await prisma.banner.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        imageUrl: b.imageUrl,
        title: b.title || '',
        subtitle: b.subtitle || '',
        link: b.link || '',
        isActive: b.isActive ?? true,
        order: b.order ?? 0,
        createdAt: parseDate(b.createdAt) ?? new Date(),
        updatedAt: parseDate(b.updatedAt) ?? new Date(),
      },
      update: {
        imageUrl: b.imageUrl,
        isActive: b.isActive ?? true,
        order: b.order ?? 0,
        updatedAt: parseDate(b.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ banners: ${banners.length}`);

  const blogPosts = loadJson<any>('blogPosts');
  for (const p of blogPosts) {
    const coverUrl = p.coverImage?.url || p.imageUrl || null;
    await prisma.blogPost.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        contentMarkdown: p.contentMarkdown || p.content || '',
        contentHtml: p.contentHtml || p.contentMarkdown || '',
        excerpt: p.excerpt || '',
        authorName: p.authorName || p.author || 'Admin',
        categoryId: p.categoryId,
        tags: p.tags || [],
        status: (p.status as BlogPostStatus) || 'published',
        featured: p.featured ?? false,
        readTime: p.readTime ?? 1,
        viewCount: p.viewCount ?? 0,
        coverImageUrl: coverUrl,
        coverPublicId: p.coverImage?.publicId,
        seo: p.seo ?? {},
        publishedAt: parseDate(p.publishedAt),
        createdAt: parseDate(p.createdAt) ?? new Date(),
        updatedAt: parseDate(p.updatedAt) ?? new Date(),
      },
      update: {
        title: p.title,
        status: (p.status as BlogPostStatus) || 'published',
        viewCount: p.viewCount ?? 0,
        updatedAt: parseDate(p.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ blogPosts: ${blogPosts.length}`);

  const contacts = loadJson<any>('contacts');
  for (const c of contacts) {
    await prisma.contact.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: mapContactStatus(c.status),
        userAgent: c.userAgent,
        createdAt: parseDate(c.createdAt) ?? new Date(),
        updatedAt: parseDate(c.updatedAt) ?? new Date(),
      },
      update: {
        status: mapContactStatus(c.status),
        updatedAt: parseDate(c.updatedAt) ?? new Date(),
      },
    });
  }
  console.log(`✅ contacts: ${contacts.length}`);

  const settings = loadJson<any>('settings');
  const center = settings[0];
  if (center) {
    await prisma.centerInfo.upsert({
      where: { id: 'center-info' },
      create: {
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
        updatedAt: parseDate(center.updatedAt) ?? new Date(),
      },
      update: {
        name: center.name,
        description: center.description,
        updatedAt: parseDate(center.updatedAt) ?? new Date(),
      },
    });
    console.log('✅ center_info');
  }

  await prisma.galleryImage.deleteMany();
  for (let i = 0; i < GALLERY_IMAGES.length; i++) {
    await prisma.galleryImage.create({
      data: {
        url: GALLERY_IMAGES[i],
        alt: `Hình thực tế ${i + 1}`,
        order: i + 1,
        isActive: true,
      },
    });
  }
  console.log(`✅ gallery_images: ${GALLERY_IMAGES.length}`);

  for (const asset of SITE_ASSETS) {
    await prisma.siteAsset.upsert({
      where: { key: asset.key },
      create: asset,
      update: { url: asset.url, alt: asset.alt },
    });
  }
  console.log(`✅ site_assets: ${SITE_ASSETS.length}`);

  console.log('\n🎉 Seed complete!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
