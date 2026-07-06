'use server';

import { prisma } from '@/lib/prisma';
import type { User, UserRole } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/types/auth';

function mapDbUser(record: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  avatar: string | null;
  createdAt: Date;
  lastLogin: Date | null;
  isActive: boolean;
}): User {
  return {
    uid: record.id,
    email: record.email,
    name: record.name,
    role: record.role,
    phone: record.phone ?? undefined,
    avatar: record.avatar ?? undefined,
    createdAt: record.createdAt,
    lastLogin: record.lastLogin ?? new Date(),
    isActive: record.isActive,
    permissions: ROLE_PERMISSIONS[record.role] || [],
  };
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const profile = await prisma.user.findUnique({ where: { id: userId } });
    if (!profile) return null;
    return mapDbUser(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function syncUserOnLogin(
  userId: string,
  email: string,
  name?: string
): Promise<User | null> {
  try {
    const profile = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        name: name || email.split('@')[0],
        role: 'user',
        lastLogin: new Date(),
      },
      update: { lastLogin: new Date() },
    });
    return mapDbUser(profile);
  } catch (error) {
    console.error('Error syncing user on login:', error);
    return null;
  }
}

export async function createUserProfile(data: {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: UserRole;
}): Promise<User | null> {
  try {
    const profile = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role ?? 'user',
        lastLogin: new Date(),
      },
    });
    return mapDbUser(profile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: updates.name,
        phone: updates.phone,
        avatar: updates.avatar,
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}
