'use server';

import { revalidatePath } from 'next/cache';
import type { CenterInfo, GalleryImage, Prisma, SiteAsset } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type SetCenterInfoInput = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  history: string;
  mission: string;
  vision: string;
  slogan: string;
  workingHours: Prisma.InputJsonValue;
};

export type GalleryImageInput = {
  id?: string;
  url: string;
  alt?: string;
  title?: string;
  order?: number;
  isActive?: boolean;
};

export type SiteAssetInput = {
  key: string;
  url: string;
  alt?: string;
  label?: string;
};

export async function setCenterInfo(input: SetCenterInfoInput): Promise<ActionResult<CenterInfo>> {
  try {
    const centerInfo = await prisma.centerInfo.upsert({
      where: { id: 'center-info' },
      create: {
        id: 'center-info',
        ...input,
      },
      update: input,
    });

    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/panel/settings');
    return { success: true, data: centerInfo };
  } catch (error) {
    console.error('setCenterInfo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lưu thông tin trung tâm',
    };
  }
}

export async function upsertGalleryImages(
  images: GalleryImageInput[]
): Promise<ActionResult<GalleryImage[]>> {
  try {
    const results = await prisma.$transaction(
      images.map((image, index) => {
        const data = {
          url: image.url,
          alt: image.alt,
          title: image.title,
          order: image.order ?? index + 1,
          isActive: image.isActive ?? true,
        };

        if (image.id) {
          return prisma.galleryImage.update({
            where: { id: image.id },
            data,
          });
        }

        return prisma.galleryImage.create({ data });
      })
    );

    revalidatePath('/about');
    revalidatePath('/panel/settings');
    return { success: true, data: results };
  } catch (error) {
    console.error('upsertGalleryImages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lưu ảnh gallery',
    };
  }
}

export async function upsertSiteAsset(input: SiteAssetInput): Promise<ActionResult<SiteAsset>> {
  try {
    const asset = await prisma.siteAsset.upsert({
      where: { key: input.key },
      create: {
        key: input.key,
        url: input.url,
        alt: input.alt,
        label: input.label,
      },
      update: {
        url: input.url,
        alt: input.alt,
        label: input.label,
      },
    });

    revalidatePath('/');
    revalidatePath('/panel/settings');
    return { success: true, data: asset };
  } catch (error) {
    console.error('upsertSiteAsset:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lưu site asset',
    };
  }
}
