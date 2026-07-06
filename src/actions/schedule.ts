'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { Prisma, Schedule, ScheduleStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type CreateScheduleInput = {
  classId: string;
  tutorId: string;
  startDate: Date | string;
  startTime: string;
  endTime: string;
  maxStudents?: number;
  studentPhones?: string[];
  status?: ScheduleStatus;
};

export type UpdateScheduleInput = Partial<{
  classId: string;
  tutorId: string;
  startDate: Date | string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  studentPhones: string[];
  status: ScheduleStatus;
}>;

async function resolveScheduleRelations(classId: string, tutorId: string) {
  const [classRecord, tutor] = await Promise.all([
    prisma.class.findUnique({ where: { id: classId } }),
    prisma.tutor.findUnique({ where: { id: tutorId } }),
  ]);

  if (!classRecord) {
    return { error: 'Lớp học không tồn tại' } as const;
  }
  if (!tutor) {
    return { error: 'Gia sư không tồn tại' } as const;
  }

  return {
    className: classRecord.name,
    tutorName: tutor.name,
  } as const;
}

function parseStartDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export async function createSchedule(input: CreateScheduleInput): Promise<ActionResult<Schedule>> {
  try {
    const relations = await resolveScheduleRelations(input.classId, input.tutorId);
    if ('error' in relations) {
      return { success: false, error: relations.error };
    }

    const schedule = await prisma.schedule.create({
      data: {
        id: randomUUID(),
        classId: input.classId,
        className: relations.className,
        tutorId: input.tutorId,
        tutorName: relations.tutorName,
        startDate: parseStartDate(input.startDate),
        startTime: input.startTime,
        endTime: input.endTime,
        maxStudents: input.maxStudents ?? 12,
        studentPhones: input.studentPhones ?? [],
        status: input.status ?? 'scheduled',
      },
    });

    revalidatePath('/schedule');
    revalidatePath('/panel/schedules');
    return { success: true, data: schedule };
  } catch (error) {
    console.error('createSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo lịch học',
    };
  }
}

export async function updateSchedule(
  id: string,
  input: UpdateScheduleInput
): Promise<ActionResult<Schedule>> {
  try {
    const data: Prisma.ScheduleUpdateInput = {};

    if (input.startDate !== undefined) {
      data.startDate = parseStartDate(input.startDate);
    }
    if (input.startTime !== undefined) data.startTime = input.startTime;
    if (input.endTime !== undefined) data.endTime = input.endTime;
    if (input.maxStudents !== undefined) data.maxStudents = input.maxStudents;
    if (input.studentPhones !== undefined) data.studentPhones = input.studentPhones;
    if (input.status !== undefined) data.status = input.status;

    const classId = input.classId;
    const tutorId = input.tutorId;

    if (classId) {
      const classRecord = await prisma.class.findUnique({ where: { id: classId } });
      if (!classRecord) {
        return { success: false, error: 'Lớp học không tồn tại' };
      }
      data.class = { connect: { id: classId } };
      data.className = classRecord.name;
    }

    if (tutorId) {
      const tutor = await prisma.tutor.findUnique({ where: { id: tutorId } });
      if (!tutor) {
        return { success: false, error: 'Gia sư không tồn tại' };
      }
      data.tutor = { connect: { id: tutorId } };
      data.tutorName = tutor.name;
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data,
    });

    revalidatePath('/schedule');
    revalidatePath('/panel/schedules');
    return { success: true, data: schedule };
  } catch (error) {
    console.error('updateSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật lịch học',
    };
  }
}

export async function deleteSchedule(id: string): Promise<ActionResult> {
  try {
    await prisma.schedule.delete({ where: { id } });

    revalidatePath('/schedule');
    revalidatePath('/panel/schedules');
    return { success: true };
  } catch (error) {
    console.error('deleteSchedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa lịch học',
    };
  }
}
