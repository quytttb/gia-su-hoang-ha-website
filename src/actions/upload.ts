'use server';

import { randomUUID } from 'crypto';
import { createServiceClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;

export type UploadBucket = 'banners' | 'tutors' | 'blog-covers' | 'gallery';

export type UploadResult = {
  url: string;
  path: string;
};

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'Kích thước file phải nhỏ hơn 5MB';
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return 'Chỉ chấp nhận ảnh JPEG, PNG và WebP';
  }

  return null;
}

function getFileExtension(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && ['jpg', 'jpeg', 'png', 'webp'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }

  switch (file.type) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

export async function uploadFile(
  formData: FormData,
  bucket: UploadBucket
): Promise<ActionResult<UploadResult>> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase chưa được cấu hình' };
    }

    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Không tìm thấy file upload' };
    }

    const validationError = validateFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createServiceClient();
    const extension = getFileExtension(file);
    const path = `${Date.now()}-${randomUUID()}.${extension}`;

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      data: {
        url: publicUrlData.publicUrl,
        path: data.path,
      },
    };
  } catch (error) {
    console.error('uploadFile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể upload file',
    };
  }
}
