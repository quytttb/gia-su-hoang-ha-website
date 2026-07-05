import { UploadResult, UploadProgress } from './uploadService';
import { env } from '@/lib/env';

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: env.cloudinaryCloudName || 'dobcvvl12',
  uploadPreset: env.cloudinaryUploadPreset || 'ml_default', // Default unsigned preset
  apiKey: env.cloudinaryApiKey,
};

export class CloudinaryService {
  // Upload image to Cloudinary
  static async uploadImage(
    file: File,
    folder: string = 'banners',
    onProgress?: (progress: UploadProgress) => void,
    customFilename?: string,
    order?: number
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file);

      // Check configuration
      if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
        throw new Error('Cloudinary is not configured');
      }

      // Update progress
      onProgress?.({
        progress: 0,
        isUploading: true,
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', folder);
      formData.append('resource_type', 'image');

      // Generate public_id
      let publicId;
      if (customFilename && order !== undefined) {
        // Slug the custom filename
        const slug = customFilename
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim();

        // Format order with leading zeros (e.g., 01, 02, etc.)
        const orderStr = order.toString().padStart(2, '0');

        // Final format: folder/slug-order
        publicId = `${folder}/${slug}-${orderStr}`;
      } else {
        // Fallback to original method if no custom filename or order provided
        const originalName = file.name.split('.')[0];
        const slug = originalName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Generate a timestamp-based unique ID if we don't have order
        const timestamp = Date.now().toString().slice(-6);
        publicId = `${folder}/${slug}-${timestamp}`;
      }

      formData.append('public_id', publicId);

      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      onProgress?.({
        progress: 80,
        isUploading: true,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();

      onProgress?.({
        progress: 100,
        isUploading: false,
      });

      return {
        url: result.secure_url,
        path: result.public_id,
        name: result.original_filename || file.name,
        size: result.bytes || file.size,
      };
    } catch (error: any) {
      onProgress?.({
        progress: 0,
        isUploading: false,
        error: error.message,
      });

      // Provide user-friendly error messages
      let errorMessage = 'Upload failed';
      if (error.message.includes('not configured')) {
        errorMessage = 'Cloudinary chưa được cấu hình. Vui lòng liên hệ admin.';
      } else if (error.message.includes('Invalid image')) {
        errorMessage = 'File không phải là hình ảnh hợp lệ.';
      } else if (error.message.includes('File too large')) {
        errorMessage = 'File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.';
      } else {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  // Upload banner image specifically
  static async uploadBannerImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    customFilename?: string,
    order?: number
  ): Promise<UploadResult> {
    return this.uploadImage(file, 'banners', onProgress, customFilename, order);
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId: string): Promise<void> {
    try {
      if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.apiKey) {
        throw new Error('Cloudinary is not configured for deletion');
      }

      // Note: Image deletion requires server-side API call with API secret
      // For security, this should be implemented in your backend
      console.warn('Image deletion should be handled by backend API');

      // For now, we'll just log the public_id
      console.log('Image to delete:', publicId);
    } catch (error: any) {
      console.error('Error deleting image:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Generate optimized image URL
  static getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
      crop?: 'fill' | 'fit' | 'scale' | 'crop';
    } = {}
  ): string {
    if (!CLOUDINARY_CONFIG.cloudName) {
      return publicId; // Return original if not configured
    }

    const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options;

    let transformations: string[] = [];

    if (width || height) {
      const dimensions = [width && `w_${width}`, height && `h_${height}`, `c_${crop}`]
        .filter(Boolean)
        .join(',');
      transformations.push(dimensions);
    }

    if (quality) {
      transformations.push(`q_${quality}`);
    }

    if (format) {
      transformations.push(`f_${format}`);
    }

    const transformString = transformations.length > 0 ? `/${transformations.join('/')}/` : '/';

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload${transformString}${publicId}`;
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

  // Check if URL is from Cloudinary
  static isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
  }

  // Extract public ID from Cloudinary URL
  static extractPublicIdFromUrl(url: string): string | null {
    try {
      if (!this.isCloudinaryUrl(url)) {
        return null;
      }

      // Pattern: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/image.jpg
      const regex = /\/upload\/(?:v\d+\/)?(.+)$/;
      const match = url.match(regex);

      if (match && match[1]) {
        // Remove file extension
        return match[1].replace(/\.[^/.]+$/, '');
      }

      return null;
    } catch {
      return null;
    }
  }
}
