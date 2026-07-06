'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { Class, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type CreateClassInput = {
  name: string;
  description: string;
  category: string;
  price: number;
  discount?: number;
  discountEndDate?: string;
  imageUrl?: string;
  featured?: boolean;
  isActive?: boolean;
  targetAudience?: string;
  schedule?: string;
};

export type UpdateClassInput = Partial<CreateClassInput>;

export async function createClass(input: CreateClassInput): Promise<ActionResult<Class>> {
  try {
    const classRecord = await prisma.class.create({
      data: {
        id: randomUUID(),
        name: input.name,
        description: input.description,
        category: input.category,
        price: input.price,
        discount: input.discount ?? 0,
        discountEndDate: input.discountEndDate,
        imageUrl: input.imageUrl,
        featured: input.featured ?? false,
        isActive: input.isActive ?? true,
        targetAudience: input.targetAudience ?? 'Học sinh',
        schedule: input.schedule ?? 'Linh hoạt',
      },
    });

    revalidatePath('/');
    revalidatePath('/classes');
    revalidatePath('/panel/classes');
    return { success: true, data: classRecord };
  } catch (error) {
    console.error('createClass:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo lớp học',
    };
  }
}

export async function updateClass(
  id: string,
  input: UpdateClassInput
): Promise<ActionResult<Class>> {
  try {
    const data: Prisma.ClassUpdateInput = { ...input };

    const classRecord = await prisma.class.update({
      where: { id },
      data,
    });

    if (input.name) {
      await prisma.schedule.updateMany({
        where: { classId: id },
        data: { className: input.name },
      });
    }

    revalidatePath('/');
    revalidatePath('/classes');
    revalidatePath(`/classes/${id}`);
    revalidatePath('/panel/classes');
    revalidatePath('/schedule');
    return { success: true, data: classRecord };
  } catch (error) {
    console.error('updateClass:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật lớp học',
    };
  }
}

export async function deleteClass(id: string): Promise<ActionResult> {
  try {
    await prisma.class.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/classes');
    revalidatePath('/panel/classes');
    revalidatePath('/schedule');
    return { success: true };
  } catch (error) {
    console.error('deleteClass:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa lớp học',
    };
  }
}
