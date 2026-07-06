'use server';

import { revalidatePath } from 'next/cache';
import type { Banner, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

function generateBannerId(title: string, order: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  const orderStr = order.toString().padStart(2, '0');
  return `banner-${slug || 'untitled'}-${orderStr}`;
}

export type CreateBannerInput = {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean;
  order?: number;
};

export type UpdateBannerInput = Partial<CreateBannerInput>;

export async function createBanner(input: CreateBannerInput): Promise<ActionResult<Banner>> {
  try {
    const order =
      input.order ??
      ((await prisma.banner.aggregate({ _max: { order: true } }))._max.order ?? 0) + 1;

    const title = input.title ?? '';
    const id = generateBannerId(title, order);

    const banner = await prisma.banner.create({
      data: {
        id,
        imageUrl: input.imageUrl,
        title,
        subtitle: input.subtitle ?? '',
        link: input.link ?? '',
        isActive: input.isActive ?? true,
        order,
      },
    });

    revalidatePath('/');
    revalidatePath('/panel/banners');
    return { success: true, data: banner };
  } catch (error) {
    console.error('createBanner:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo banner',
    };
  }
}

export async function updateBanner(
  id: string,
  input: UpdateBannerInput
): Promise<ActionResult<Banner>> {
  try {
    const data: Prisma.BannerUpdateInput = { ...input };

    const banner = await prisma.banner.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    revalidatePath('/panel/banners');
    return { success: true, data: banner };
  } catch (error) {
    console.error('updateBanner:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật banner',
    };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    await prisma.banner.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/panel/banners');
    return { success: true };
  } catch (error) {
    console.error('deleteBanner:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa banner',
    };
  }
}

export async function reorderBanners(orderedIds: string[]): Promise<ActionResult<Banner[]>> {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });

    revalidatePath('/');
    revalidatePath('/panel/banners');
    return { success: true, data: banners };
  } catch (error) {
    console.error('reorderBanners:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể sắp xếp banner',
    };
  }
}
