'use server';

import { prisma } from '@/lib/prisma';
import type { Tutor } from '@/types';

type TutorRecord = Awaited<ReturnType<typeof prisma.tutor.findMany>>[number];

function toTutor(record: TutorRecord): Tutor {
  return {
    id: record.id,
    name: record.name,
    specialty: record.specialty,
    bio: record.bio,
    imageUrl: record.imageUrl,
  };
}

export async function getAllTutors(): Promise<Tutor[]> {
  try {
    const records = await prisma.tutor.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map(toTutor);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return [];
  }
}

export async function getActiveTutors(): Promise<Tutor[]> {
  try {
    const records = await prisma.tutor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return records.map(toTutor);
  } catch (error) {
    console.error('Error fetching active tutors:', error);
    return [];
  }
}

export async function getTutorById(id: string): Promise<Tutor | null> {
  try {
    const record = await prisma.tutor.findUnique({ where: { id } });
    if (!record) return null;
    return toTutor(record);
  } catch (error) {
    console.error('Error fetching tutor by id:', error);
    return null;
  }
}
