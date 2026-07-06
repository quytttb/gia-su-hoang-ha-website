'use server';

import { revalidatePath } from 'next/cache';
import type { Contact, ContactStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
  userAgent?: string | null;
};

function toContactMessage(record: Contact): ContactMessage {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    message: record.message,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    userAgent: record.userAgent,
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const records = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(toContactMessage);
  } catch (error) {
    console.error('getContactMessages:', error);
    return [];
  }
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<ActionResult<ContactMessage>> {
  try {
    const record = await prisma.contact.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/panel/inquiries');
    return { success: true, data: toContactMessage(record) };
  } catch (error) {
    console.error('updateContactStatus:', error);
    return { success: false, error: 'Không thể cập nhật trạng thái tin nhắn' };
  }
}

export async function getNewContactCount(): Promise<number> {
  try {
    return await prisma.contact.count({ where: { status: 'new' } });
  } catch {
    return 0;
  }
}

export async function getRecentNewContacts(limit = 5): Promise<ContactMessage[]> {
  try {
    const records = await prisma.contact.findMany({
      where: { status: 'new' },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return records.map(toContactMessage);
  } catch {
    return [];
  }
}

export async function deleteContactMessage(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.contact.delete({ where: { id } });
    revalidatePath('/panel/inquiries');
    return { success: true };
  } catch (error) {
    console.error('deleteContactMessage:', error);
    return { success: false, error: 'Không thể xóa tin nhắn' };
  }
}
