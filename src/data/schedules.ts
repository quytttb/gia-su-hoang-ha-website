'use server';

import { prisma } from '@/lib/prisma';
import type { Schedule } from '@/types';

type ScheduleRecord = Awaited<ReturnType<typeof prisma.schedule.findMany>>[number];

function toSchedule(record: ScheduleRecord): Schedule {
  return {
    id: record.id,
    classId: record.classId,
    className: record.className,
    startDate: record.startDate.toISOString().split('T')[0],
    startTime: record.startTime,
    endTime: record.endTime,
    tutorId: record.tutorId,
    tutorName: record.tutorName,
    maxStudents: record.maxStudents,
    studentPhones: record.studentPhones,
    status: record.status,
  };
}

function sortSchedules(schedules: Schedule[]): Schedule[] {
  return schedules.sort((a, b) => {
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    return a.startTime.localeCompare(b.startTime);
  });
}

export async function getAllSchedules(): Promise<Schedule[]> {
  try {
    const records = await prisma.schedule.findMany();
    return sortSchedules(records.map(toSchedule));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}

export async function getSchedulesByClassId(classId: string): Promise<Schedule[]> {
  try {
    const records = await prisma.schedule.findMany({
      where: { classId },
    });
    return sortSchedules(records.map(toSchedule));
  } catch (error) {
    console.error('Error fetching schedules by class id:', error);
    return [];
  }
}

export async function getSchedulesByDate(date: string): Promise<Schedule[]> {
  try {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    const records = await prisma.schedule.findMany({
      where: { startDate: { gte: start, lte: end } },
    });
    return sortSchedules(records.map(toSchedule));
  } catch (error) {
    console.error('Error fetching schedules by date:', error);
    return [];
  }
}

export async function getSchedulesByPhone(phone: string): Promise<Schedule[]> {
  try {
    const records = await prisma.schedule.findMany({
      where: { studentPhones: { has: phone } },
    });
    return sortSchedules(records.map(toSchedule));
  } catch (error) {
    console.error('Error fetching schedules by phone:', error);
    return [];
  }
}

export async function getAvailableScheduleDates(): Promise<string[]> {
  try {
    const records = await prisma.schedule.findMany({ select: { startDate: true } });
    const dates = records.map(r => r.startDate.toISOString().split('T')[0]);
    return Array.from(new Set(dates)).sort();
  } catch (error) {
    console.error('Error fetching available schedule dates:', error);
    return [];
  }
}
