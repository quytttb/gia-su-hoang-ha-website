import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Dialog as PreviewDialog, DialogContent as PreviewDialogContent } from '../../ui/dialog';
import { bannerFormSchema } from '@/lib/validations/panel';
import { mapZodErrors } from '@/lib/validations/zodHelpers';
import { uploadFile } from '@/actions/upload';

type UploadProgress = {
  progress: number;
  isUploading: boolean;
};
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Dialog as CropDialog, DialogContent as CropDialogContent } from '../../ui/dialog';
import getCroppedImg from '../../../utils/cropImage';

interface BannerFormProps {
  banner?: Banner;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

// Thêm interface cho croppedAreaPixels
interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const BannerForm: React.FC<BannerFormProps> = ({ banner, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    link: '',
    isActive: true,
    order: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  // Track temporary uploaded image (after upload but before save) for cleanup if user cancels
  const [tempUploadedUrl, setTempUploadedUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        imageUrl: banner.imageUrl,
        title: banner.title,
        subtitle: banner.subtitle,
        link: banner.link || '',
        isActive: banner.isActive,
        order: banner.order,
      });
    } else {
      setFormData({
        imageUrl: '',
        title: '',
        subtitle: '',
        link: '',
        isActive: true,
        order: 1,
      });
    }
    setErrors({});
    setSelectedFile(null);
    setUploadProgress({ progress: 0, isUploading: false });
    setIsSubmitting(false);
    setSuccessMessage(null);
    setTempUploadedUrl(null);
    setSaved(false);
  }, [banner, isOpen]);

  useEffect(() => {
    return () => {
      if (!saved && tempUploadedUrl && tempUploadedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempUploadedUrl);
      }
    };
  }, [saved, tempUploadedUrl]);

  const validateForm = () => {
    const result = bannerFormSchema.safeParse(formData);
    const newErrors = result.success ? {} : mapZodErrors(result.error);
    if (!formData.imageUrl.trim() && !selectedFile) newErrors.imageUrl = 'Hình ảnh là bắt buộc';
    if (formData.order < 1) newErrors.order = 'Thứ tự phải lớn hơn 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload file if a new file is selected
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return; // Upload failed
        }
        finalImageUrl = uploadedUrl;
        console.log('Upload successful:', finalImageUrl);
        setTempUploadedUrl(uploadedUrl); // track for cleanup
      }

      // Save banner with final image URL
      console.log('Saving banner data:', { ...formData, imageUrl: finalImageUrl });
      await onSave({
        ...formData,
        link: formData.link === 'none' ? '' : formData.link,
        imageUrl: finalImageUrl,
      });
      setSaved(true);

      // Show success message briefly before closing
      setSuccessMessage(
        banner ? 'Banner đã được cập nhật thành công!' : 'Banner đã được tạo thành công!'
      );

      // Close form after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving banner:', error);
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Có lỗi xảy ra khi lưu banner',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: '',
      }));
    }

    // Clear success message
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCropImage(previewUrl);
      setShowCrop(true);
      setSelectedFile(file);
      // Không set formData.imageUrl ở đây nữa
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    }
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setFormData(prev => ({ ...prev, imageUrl: croppedUrl }));
    setSelectedFile(
      new File([croppedBlob], selectedFile?.name || 'cropped.jpg', { type: croppedBlob.type })
    );
    setShowCrop(false);
  };

  // Handle file upload
  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      setUploadProgress({ progress: 0, isUploading: true });
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      const result = await uploadFile(formDataUpload, 'banners');
      setUploadProgress({ progress: 100, isUploading: false });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Lỗi upload hình ảnh');
      }

      return result.data.url;
    } catch (error: unknown) {
      setUploadProgress({ progress: 0, isUploading: false });
      const message = error instanceof Error ? error.message : 'Lỗi upload hình ảnh';
      setErrors(prev => ({
        ...prev,
        imageUrl: message,
      }));
      return null;
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: banner?.imageUrl || '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading = uploadProgress.isUploading || isSubmitting;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) {
            onClose();
          }
        }}
      >
        <DialogContent className="md:max-w-[900px] max-w-3xl">
          <DialogHeader>
            <DialogTitle>{banner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}</DialogTitle>
            <DialogDescription>
              {banner
                ? 'Cập nhật thông tin banner hiện tại.'
                : 'Tạo banner mới để hiển thị trên trang chủ.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái: Thông tin banner */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tiêu đề <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề banner"
                    className={errors.title ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle">
                    Phụ đề <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                  </Label>
                  <textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={e => handleInputChange('subtitle', e.target.value)}
                    placeholder="Nhập phụ đề banner"
                    rows={4}
                    className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ${errors.subtitle ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle}</p>}
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label htmlFor="link">
                    Liên kết <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={e => handleInputChange('link', e.target.value)}
                    placeholder="Dán hoặc nhập link liên kết (nếu có)"
                    disabled={isLoading}
                  />
                </div>

                {/* Order and Active */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Thứ tự hiển thị *</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={e => handleInputChange('order', parseInt(e.target.value) || 1)}
                      className={errors.order ? 'border-destructive' : ''}
                      disabled={isLoading}
                    />
                    {errors.order && <p className="text-sm text-destructive">{errors.order}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isActive">Trạng thái</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={checked => handleInputChange('isActive', checked)}
                        disabled={isLoading}
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Upload và xem trước ảnh */}
              <div className="space-y-4 flex flex-col items-center justify-start">
                <div className="w-full space-y-2">
                  <Label htmlFor="imageFile">Hình ảnh Banner *</Label>
                  <div className="space-y-3">
                    {/* File Input */}
                    <div className="flex items-center space-x-2">
                      <input
                        ref={fileInputRef}
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                      >
                        {uploadProgress.isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <span>{selectedFile ? 'Thay đổi ảnh' : 'Chọn ảnh'}</span>
                      </Button>
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress.isUploading && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Đang tải lên...</span>
                          <span>{uploadProgress.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* File Info */}
                    {selectedFile && (
                      <div className="text-sm text-muted-foreground">
                        <p>Tệp đã chọn: {selectedFile.name}</p>
                        <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}

                    {/* Error */}
                    {errors.imageUrl && (
                      <p className="text-sm text-destructive">{errors.imageUrl}</p>
                    )}

                    {/* Preview */}
                    {formData.imageUrl && (
                      <div className="mt-2 w-full flex flex-col items-center justify-center">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-32 w-auto max-w-full object-contain rounded-md border cursor-zoom-in"
                          onClick={() => setIsPreviewOpen(true)}
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          Nhấn vào hình để phóng to
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || !!successMessage}
                className="flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {isLoading
                    ? uploadProgress.isUploading
                      ? 'Đang tải lên...'
                      : 'Đang lưu...'
                    : banner
                      ? 'Cập nhật'
                      : 'Thêm mới'}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog phóng to ảnh */}
      {formData.imageUrl && (
        <PreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <PreviewDialogContent className="max-w-4xl flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-foreground bg-background rounded-full p-1 hover:bg-muted"
              onClick={() => setIsPreviewOpen(false)}
              type="button"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={formData.imageUrl}
              alt="Phóng to ảnh banner"
              className="max-h-[90vh] w-auto max-w-full object-contain rounded-md border"
            />
          </PreviewDialogContent>
        </PreviewDialog>
      )}
      {/* Crop Dialog */}
      {showCrop && (
        <CropDialog open={showCrop} onOpenChange={setShowCrop}>
          <CropDialogContent className="max-w-2xl">
            <div className="relative w-full h-80 bg-gray-900">
              <Cropper
                image={cropImage!}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowCrop(false)}>
                Hủy
              </Button>
              <Button onClick={handleCropSave}>Cắt & chọn ảnh</Button>
            </div>
          </CropDialogContent>
        </CropDialog>
      )}
    </>
  );
};

export default BannerForm;
