'use server';

import { prisma } from '@/lib/prisma';
import type { CenterInfo, WorkingHours } from '@/types';

type GalleryImageRecord = Awaited<ReturnType<typeof prisma.galleryImage.findMany>>[number];

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  order: number;
}

export interface SiteAsset {
  url: string;
  alt?: string;
  label?: string;
}

function parseWorkingHours(value: unknown): WorkingHours {
  if (value && typeof value === 'object' && 'weekdays' in value && 'weekend' in value) {
    const hours = value as Record<string, unknown>;
    return {
      weekdays: String(hours.weekdays ?? ''),
      weekend: String(hours.weekend ?? ''),
    };
  }
  return { weekdays: '', weekend: '' };
}

export async function getCenterInfo(): Promise<CenterInfo | null> {
  try {
    const record = await prisma.centerInfo.findUnique({
      where: { id: 'center-info' },
    });
    if (!record) return null;

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      address: record.address,
      phone: record.phone,
      email: record.email,
      history: record.history,
      mission: record.mission,
      vision: record.vision,
      slogan: record.slogan,
      workingHours: parseWorkingHours(record.workingHours),
    };
  } catch (error) {
    console.error('Error fetching center info:', error);
    return null;
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const records = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return records.map((record: GalleryImageRecord) => ({
      id: record.id,
      url: record.url,
      alt: record.alt ?? undefined,
      title: record.title ?? undefined,
      order: record.order,
    }));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export async function getSiteAsset(key: string): Promise<SiteAsset | null> {
  try {
    const record = await prisma.siteAsset.findUnique({ where: { key } });
    if (!record) return null;

    return {
      url: record.url,
      alt: record.alt ?? undefined,
      label: record.label ?? undefined,
    };
  } catch (error) {
    console.error('Error fetching site asset:', error);
    return null;
  }
}
