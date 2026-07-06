'use server';

import { prisma } from '@/lib/prisma';
import type { Registration } from '@/types';

type RegistrationRecord = Awaited<ReturnType<typeof prisma.registration.findMany>>[number];

export interface RegistrationFilters {
  status?: Registration['status'];
  classId?: string;
  userId?: string;
}

function toIsoString(value: Date | null | undefined): string | undefined {
  return value ? value.toISOString() : undefined;
}

function toTutorType(value: string | null | undefined): Registration['tutorType'] {
  if (value === 'teacher' || value === 'student') return value;
  return undefined;
}

function toRegistration(record: RegistrationRecord): Registration {
  return {
    id: record.id,
    userId: record.userId ?? undefined,
    type: record.type,
    classId: record.classId ?? undefined,
    className: record.className ?? undefined,
    tutorType: toTutorType(record.tutorType),
    tutorCriteria: record.tutorCriteria ?? undefined,
    studentName: record.studentName,
    studentPhone: record.studentPhone,
    studentSchool: record.studentSchool,
    parentName: record.parentName,
    parentPhone: record.parentPhone,
    parentAddress: record.parentAddress,
    preferredSchedule: record.preferredSchedule,
    notes: record.notes ?? undefined,
    registrationDate: record.registrationDate?.toISOString() ?? record.createdAt.toISOString(),
    status: record.status,
    approvedBy: record.approvedById ?? undefined,
    approvedByName: record.approvedByName ?? undefined,
    approvedAt: toIsoString(record.approvedAt),
    rejectionReason: record.rejectionReason ?? undefined,
    matchedTutorId: record.matchedTutorId ?? undefined,
    matchedTutorName: record.matchedTutorName ?? undefined,
    matchedAt: toIsoString(record.matchedAt),
    trialScheduledAt: toIsoString(record.trialScheduledAt),
    staffNotes: record.staffNotes ?? undefined,
  };
}

export async function getRegistrations(filters?: RegistrationFilters): Promise<Registration[]> {
  try {
    const where: {
      status?: Registration['status'];
      classId?: string;
      userId?: string;
    } = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.classId) where.classId = filters.classId;
    if (filters?.userId) where.userId = filters.userId;

    const records = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(toRegistration);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

export async function getRegistrationById(id: string): Promise<Registration | null> {
  try {
    const record = await prisma.registration.findUnique({ where: { id } });
    if (!record) return null;
    return toRegistration(record);
  } catch (error) {
    console.error('Error fetching registration by id:', error);
    return null;
  }
}
