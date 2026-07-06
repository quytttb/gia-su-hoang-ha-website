'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { Prisma, Tutor } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type CreateTutorInput = {
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  bio: string;
  experience?: string;
  education?: string;
  imageUrl: string;
  subjects?: string[];
  availability?: string[];
  isActive?: boolean;
  hourlyRate?: number;
  rating?: number;
  totalStudents?: number;
};

export type UpdateTutorInput = Partial<CreateTutorInput>;

export async function createTutor(input: CreateTutorInput): Promise<ActionResult<Tutor>> {
  try {
    const tutor = await prisma.tutor.create({
      data: {
        id: randomUUID(),
        name: input.name,
        email: input.email,
        phone: input.phone,
        specialty: input.specialty,
        bio: input.bio,
        experience: input.experience ?? '',
        education: input.education ?? '',
        imageUrl: input.imageUrl,
        subjects: input.subjects ?? [],
        availability: input.availability ?? [],
        isActive: input.isActive ?? true,
        hourlyRate: input.hourlyRate,
        rating: input.rating,
        totalStudents: input.totalStudents,
      },
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/panel/tutors');
    return { success: true, data: tutor };
  } catch (error) {
    console.error('createTutor:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo gia sư',
    };
  }
}

export async function updateTutor(
  id: string,
  input: UpdateTutorInput
): Promise<ActionResult<Tutor>> {
  try {
    const data: Prisma.TutorUpdateInput = { ...input };

    const tutor = await prisma.tutor.update({
      where: { id },
      data,
    });

    if (input.name) {
      await prisma.schedule.updateMany({
        where: { tutorId: id },
        data: { tutorName: input.name },
      });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/panel/tutors');
    revalidatePath('/schedule');
    return { success: true, data: tutor };
  } catch (error) {
    console.error('updateTutor:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật gia sư',
    };
  }
}

export async function deleteTutor(id: string): Promise<ActionResult> {
  try {
    await prisma.tutor.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/panel/tutors');
    revalidatePath('/schedule');
    return { success: true };
  } catch (error) {
    console.error('deleteTutor:', error);
    const message =
      error instanceof Error && error.message.includes('Foreign key')
        ? 'Không thể xóa gia sư đang có lịch dạy'
        : error instanceof Error
          ? error.message
          : 'Không thể xóa gia sư';
    return { success: false, error: message };
  }
}
