import { CloudinaryService } from './cloudinaryService';
import { env } from '@/lib/env';

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
}

export interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error?: string;
}

export class UploadService {
  // Upload file using Cloudinary
  static async uploadFile(
    file: File,
    folder: string = 'uploads',
    onProgress?: (progress: UploadProgress) => void,
    customFilename?: string,
    order?: number
  ): Promise<UploadResult> {
    this.validateFile(file);
    return CloudinaryService.uploadImage(file, folder, onProgress, customFilename, order);
  }

  // Upload banner image
  static async uploadBannerImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    customFilename?: string,
    order?: number
  ): Promise<UploadResult> {
    this.validateFile(file);
    return CloudinaryService.uploadImage(file, 'banners', onProgress, customFilename, order);
  }

  // Upload tutor image
  static async uploadTutorImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    customFilename?: string
  ): Promise<UploadResult> {
    this.validateFile(file);
    return CloudinaryService.uploadImage(file, 'tutors', onProgress, customFilename);
  }

  // Delete file using Cloudinary
  static async deleteFile(url: string): Promise<void> {
    try {
      if (CloudinaryService.isCloudinaryUrl(url)) {
        const publicId = CloudinaryService.extractPublicIdFromUrl(url);
        if (publicId) {
          await CloudinaryService.deleteImage(publicId);
        }
      } else {
        throw new Error('Only Cloudinary URLs are supported');
      }
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Get upload service status
  static getServiceStatus(): {
    cloudinary: boolean;
    configured: boolean;
  } {
    const cloudinaryConfigured = !!(env.cloudinaryCloudName && env.cloudinaryUploadPreset);

    return {
      cloudinary: cloudinaryConfigured,
      configured: cloudinaryConfigured,
    };
  }

  // Validate file before upload
  private static validateFile(file: File): void {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
  }

  // Get file extension from URL
  static getFileExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('.').pop() || '';
    } catch {
      return '';
    }
  }
}
