import React, { useState, useEffect, useRef } from 'react';
import { Class } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Dialog as PreviewDialog, DialogContent as PreviewDialogContent } from '../../ui/dialog';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { classFormSchema } from '@/lib/validations/panel';
import { mapZodErrors } from '@/lib/validations/zodHelpers';
import { uploadFile } from '@/actions/upload';

type UploadProgress = {
  progress: number;
  isUploading: boolean;
};

// Props cho ClassForm
interface ClassFormProps {
  class?: Class; // Nếu có class là sửa, không có là thêm mới
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Partial<Class>) => Promise<void>;
  categories: string[]; // Danh sách thể loại lớp học
}

const ClassForm: React.FC<ClassFormProps> = ({
  class: classItem,
  isOpen,
  onClose,
  onSave,
  categories,
}) => {
  // State cho form
  const [formData, setFormData] = useState<Partial<Class>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    featured: false,
    isActive: true,
    discount: 0,
    discountEndDate: '',
  });

  // State cho loading
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // Track temporary uploaded image URL (unsaved) for cleanup
  const [tempUploadedUrl, setTempUploadedUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Cập nhật formData khi classItem thay đổi (khi mở form sửa)
  useEffect(() => {
    if (classItem) {
      setFormData({
        name: classItem.name || '',
        description: classItem.description || '',
        price: classItem.price || 0,
        category: classItem.category || '',
        imageUrl: classItem.imageUrl || '',
        featured: classItem.featured || false,
        isActive: classItem.isActive !== false, // Mặc định là true nếu không có
        discount: classItem.discount || 0,
        discountEndDate: classItem.discountEndDate || '',
      });
    } else {
      // Reset form khi tạo mới
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        featured: false,
        isActive: true,
        discount: 0,
        discountEndDate: '',
      });
    }
    setErrors({});
    setSelectedFile(null);
    setUploadProgress({ progress: 0, isUploading: false });
    setSuccessMessage(null);
    setTempUploadedUrl(null);
    setSaved(false);
  }, [classItem, isOpen]);

  // Cleanup on unmount if not saved (temp preview URLs only)
  useEffect(() => {
    return () => {
      if (!saved && tempUploadedUrl && tempUploadedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempUploadedUrl);
      }
    };
  }, [saved, tempUploadedUrl]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      // Chỉ cho phép nhập số
      const cleanValue = value.replace(/[^\d]/g, '');
      const numericValue = cleanValue ? parseInt(cleanValue, 10) : 0;

      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === 'discount') {
      // Chỉ cho phép nhập số từ 0-100
      const filteredValue = value.replace(/[^\d]/g, '');
      const numericValue = filteredValue ? parseInt(filteredValue, 10) : 0;
      // Giới hạn giá trị từ 0-100
      const limitedValue = Math.min(100, Math.max(0, numericValue));

      setFormData(prev => ({
        ...prev,
        [name]: limitedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Xử lý thay đổi select
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects a value
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Xử lý thay đổi switch
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validate form
  const validateForm = () => {
    const result = classFormSchema.safeParse(formData);
    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return false;
    }
    setErrors({});
    return true;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage(null);

      let finalImageUrl = formData.imageUrl;

      // Upload file if a new file is selected
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          setLoading(false);
          return; // Upload failed
        }
        finalImageUrl = uploadedUrl;
        console.log('Upload successful:', finalImageUrl);
        setTempUploadedUrl(uploadedUrl);
      }

      // Save class with final image URL
      await onSave({
        ...formData,
        imageUrl: finalImageUrl,
      });
      setSaved(true);

      // Show success message briefly before closing
      setSuccessMessage(
        classItem ? 'Lớp học đã được cập nhật thành công!' : 'Lớp học đã được tạo thành công!'
      );

      // Close form after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Lỗi khi lưu lớp học:', error);
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Có lỗi xảy ra khi lưu lớp học. Vui lòng thử lại.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl,
      }));
      // Clear any existing error
      if (errors.imageUrl) {
        setErrors(prev => ({
          ...prev,
          imageUrl: '',
        }));
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      setUploadProgress({ progress: 0, isUploading: true });
      const formData = new FormData();
      formData.append('file', selectedFile);
      const result = await uploadFile(formData, 'gallery');
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
      imageUrl: classItem?.imageUrl || '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading = uploadProgress.isUploading || loading;

  return (
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
          <DialogTitle>{classItem ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</DialogTitle>
          <DialogDescription>
            {classItem ? 'Cập nhật thông tin lớp học' : 'Nhập thông tin cho lớp học mới'}
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
            {/* Cột trái: Thông tin lớp học */}
            <div className="space-y-4">
              {/* Tên lớp học */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên lớp học *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên lớp học"
                  className={errors.name ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về lớp học"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  disabled={isLoading}
                />
              </div>

              {/* Giá */}
              <div className="space-y-2">
                <Label htmlFor="price">Giá (VNĐ) *</Label>
                <Input
                  id="price"
                  name="price"
                  value={
                    formData.price ? new Intl.NumberFormat('de-DE').format(formData.price) : ''
                  }
                  onChange={handleChange}
                  placeholder="Nhập giá lớp học"
                  className={errors.price ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              {/* Giảm giá và Thời gian kết thúc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">
                    Giảm giá (%) <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    value={formData.discount || ''}
                    onChange={handleChange}
                    placeholder="Nhập % giảm giá"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountEndDate">
                    Thời gian kết thúc <span className="text-gray-500 text-sm">(Tùy chọn)</span>
                  </Label>
                  <Input
                    id="discountEndDate"
                    name="discountEndDate"
                    type="date"
                    value={formData.discountEndDate}
                    onChange={handleChange}
                    placeholder="Ngày kết thúc giảm giá"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Thể loại */}
              <div className="space-y-2">
                <Label htmlFor="category">Thể loại *</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleSelectChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`text-foreground ${errors.category ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Chọn thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-foreground">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              {/* Nổi bật & Trạng thái */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={checked => handleSwitchChange('featured', checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="featured">Lớp học nổi bật</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={checked => handleSwitchChange('isActive', checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="isActive">Hiển thị lớp học</Label>
                </div>
              </div>
            </div>

            {/* Cột phải: Upload và xem trước ảnh */}
            <div className="space-y-4 flex flex-col items-center justify-start">
              <div className="w-full space-y-2">
                <Label htmlFor="imageFile">Ảnh lớp học</Label>
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
                  {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}

                  {/* Preview */}
                  {formData.imageUrl && (
                    <div className="mt-2 w-full flex flex-col items-center justify-center">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-40 w-auto max-w-full object-cover rounded-md border cursor-zoom-in"
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
            <Button
              type="button"
              variant="outline"
              className="text-foreground"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !!successMessage}
              className="flex items-center space-x-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <span>
                {isLoading
                  ? uploadProgress.isUploading
                    ? 'Đang tải lên...'
                    : 'Đang lưu...'
                  : classItem
                    ? 'Cập nhật'
                    : 'Thêm mới'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

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
              alt="Phóng to ảnh lớp học"
              className="max-h-[90vh] w-auto max-w-full object-contain rounded-md border"
            />
          </PreviewDialogContent>
        </PreviewDialog>
      )}
    </Dialog>
  );
};

export default ClassForm;
