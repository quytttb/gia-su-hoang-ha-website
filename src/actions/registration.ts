'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { Registration, RegistrationStatus, RegistrationType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type CreateRegistrationInput = {
  userId?: string;
  type?: RegistrationType;
  classId?: string;
  className?: string;
  classSchedule?: string;
  studentName: string;
  studentPhone: string;
  studentSchool: string;
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  preferredSchedule?: string;
  notes?: string;
  tutorType?: string;
  tutorCriteria?: string;
};

export async function createRegistration(
  input: CreateRegistrationInput
): Promise<ActionResult<Registration>> {
  try {
    const type = input.type ?? 'class';

    if (type === 'class' && input.classId) {
      const course = await prisma.class.findUnique({ where: { id: input.classId } });
      if (!course) {
        return { success: false, error: 'Khóa học không tồn tại' };
      }
      if (!course.isActive) {
        return { success: false, error: 'Khóa học không còn hoạt động' };
      }

      const registration = await prisma.registration.create({
        data: {
          id: randomUUID(),
          userId: input.userId,
          type,
          classId: input.classId,
          className: input.className ?? course.name,
          classSchedule: input.classSchedule,
          studentName: input.studentName,
          studentPhone: input.studentPhone,
          studentSchool: input.studentSchool,
          parentName: input.parentName,
          parentPhone: input.parentPhone,
          parentAddress: input.parentAddress,
          preferredSchedule: input.preferredSchedule ?? '',
          notes: input.notes,
          status: 'pending',
          paymentStatus: 'pending',
          totalAmount: course.price,
          paidAmount: 0,
        },
      });

      revalidatePath('/panel/registrations');
      return { success: true, data: registration };
    }

    const registration = await prisma.registration.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        type,
        classId: input.classId,
        className: input.className,
        classSchedule: input.classSchedule,
        studentName: input.studentName,
        studentPhone: input.studentPhone,
        studentSchool: input.studentSchool,
        parentName: input.parentName,
        parentPhone: input.parentPhone,
        parentAddress: input.parentAddress,
        preferredSchedule: input.preferredSchedule ?? '',
        notes: input.notes,
        tutorType: input.tutorType,
        tutorCriteria: input.tutorCriteria,
        status: 'pending',
      },
    });

    revalidatePath('/panel/registrations');
    return { success: true, data: registration };
  } catch (error) {
    console.error('createRegistration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo đăng ký',
    };
  }
}

export async function approveRegistration(
  registrationId: string,
  approvedById: string,
  approvedByName?: string
): Promise<ActionResult<Registration>> {
  try {
    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'approved',
        approvedById,
        approvedByName: approvedByName ?? approvedById,
        approvedAt: new Date(),
      },
    });

    revalidatePath('/panel/registrations');
    return { success: true, data: registration };
  } catch (error) {
    console.error('approveRegistration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể duyệt đăng ký',
    };
  }
}

export async function rejectRegistration(
  registrationId: string,
  rejectionReason: string,
  rejectedById: string
): Promise<ActionResult<Registration>> {
  try {
    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'rejected',
        rejectionReason,
        approvedById: rejectedById,
      },
    });

    revalidatePath('/panel/registrations');
    return { success: true, data: registration };
  } catch (error) {
    console.error('rejectRegistration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể từ chối đăng ký',
    };
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus,
  extra?: {
    staffNotes?: string;
    matchedTutorId?: string;
    matchedTutorName?: string;
    trialScheduledAt?: Date;
    paymentStatus?: string;
    paidAmount?: number;
    rejectionReason?: string;
  }
): Promise<ActionResult<Registration>> {
  try {
    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status,
        ...extra,
        ...(extra?.matchedTutorId ? { matchedAt: new Date() } : {}),
      },
    });

    revalidatePath('/panel/registrations');
    return { success: true, data: registration };
  } catch (error) {
    console.error('updateRegistrationStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái đăng ký',
    };
  }
}
