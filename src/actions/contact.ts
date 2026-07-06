'use server';

import { randomUUID } from 'crypto';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Contact } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

export async function saveContactMessage(
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<ActionResult<Contact>> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') ?? undefined;

    const contact = await prisma.contact.create({
      data: {
        id: randomUUID(),
        name,
        email,
        phone,
        message,
        status: 'new',
        userAgent,
      },
    });

    revalidatePath('/panel/inquiries');
    return { success: true, data: contact };
  } catch (error) {
    console.error('saveContactMessage:', error);
    return {
      success: false,
      error: 'Không thể lưu tin nhắn vào cơ sở dữ liệu',
    };
  }
}
