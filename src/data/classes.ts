'use server';

import { prisma } from '@/lib/prisma';
import type { Class } from '@/types';
import { mapClassRecord } from '@/utils/classHelpers';

type ClassRecord = Awaited<ReturnType<typeof prisma.class.findMany>>[number];

export interface ClassFilters {
  category?: string;
  isActive?: boolean;
  featured?: boolean;
  priceRange?: { min: number; max: number };
}

function toClass(record: ClassRecord): Class {
  return {
    ...mapClassRecord(record),
    isActive: record.isActive,
  };
}

function applyPriceRangeFilter(classes: Class[], priceRange?: ClassFilters['priceRange']): Class[] {
  if (!priceRange) return classes;
  return classes.filter(c => c.price >= priceRange.min && c.price <= priceRange.max);
}

export async function getClasses(filters?: ClassFilters): Promise<Class[]> {
  try {
    const where: {
      category?: string;
      isActive?: boolean;
      featured?: boolean;
    } = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.featured !== undefined) where.featured = filters.featured;

    const records = await prisma.class.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });

    return applyPriceRangeFilter(records.map(toClass), filters?.priceRange);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

export async function getActiveClasses(filters?: Omit<ClassFilters, 'isActive'>): Promise<Class[]> {
  return getClasses({ ...filters, isActive: true });
}

export async function getClassById(id: string): Promise<Class | null> {
  try {
    const record = await prisma.class.findUnique({ where: { id } });
    if (!record) return null;
    return toClass(record);
  } catch (error) {
    console.error('Error fetching class by id:', error);
    return null;
  }
}

export async function getAllClasses(): Promise<Class[]> {
  try {
    const records = await prisma.class.findMany({
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    });
    return records.map(toClass);
  } catch (error) {
    console.error('Error fetching all classes:', error);
    return [];
  }
}
