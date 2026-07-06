'use server';

import { prisma } from '@/lib/prisma';
import type { Banner } from '@/types';

type BannerRecord = Awaited<ReturnType<typeof prisma.banner.findMany>>[number];

function toBanner(record: BannerRecord): Banner {
  return {
    id: record.id,
    imageUrl: record.imageUrl,
    title: record.title,
    subtitle: record.subtitle,
    link: record.link || undefined,
    isActive: record.isActive,
    order: record.order,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const records = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
    return records.map(toBanner);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const records = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return records.map(toBanner);
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return [];
  }
}
