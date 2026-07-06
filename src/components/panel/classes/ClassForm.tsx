import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Class } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Alert, AlertDescription } from '../../ui/alert';
import { Progress } from '../../ui/progress';
import DatePicker from '../../ui/date-picker';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { classFormSchema, type ClassFormValues } from '@/lib/validations/panel';
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
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      featured: false,
      isActive: true,
      discount: 0,
      discountEndDate: '',
    },
  });

  const imageUrl = form.watch('imageUrl');

  // State cho loading
  const [loading, setLoading] = useState(false);
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

  const { reset, clearErrors } = form;

  useEffect(() => {
    if (classItem) {
      reset({
        name: classItem.name || '',
        description: classItem.description || '',
        price: classItem.price || 0,
        category: classItem.category || '',
        imageUrl: classItem.imageUrl || '',
        featured: classItem.featured || false,
        isActive: classItem.isActive !== false,
        discount: classItem.discount || 0,
        discountEndDate: classItem.discountEndDate || '',
      });
    } else {
      reset({
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
    clearErrors();
    setSelectedFile(null);
    setUploadProgress({ progress: 0, isUploading: false });
    setSuccessMessage(null);
    setTempUploadedUrl(null);
    setSaved(false);
  }, [classItem, isOpen, reset, clearErrors]);

  // Cleanup on unmount if not saved (temp preview URLs only)
  useEffect(() => {
    return () => {
      if (!saved && tempUploadedUrl && tempUploadedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempUploadedUrl);
      }
    };
  }, [saved, tempUploadedUrl]);

  const [generalError, setGeneralError] = useState<string | null>(null);

  const onSubmit = async (values: ClassFormValues) => {
    try {
      setLoading(true);
      setGeneralError(null);
      setSuccessMessage(null);

      let finalImageUrl = values.imageUrl;

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
        ...values,
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
    } catch (error: unknown) {
      console.error('Lỗi khi lưu lớp học:', error);
      setGeneralError(
        error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu lớp học. Vui lòng thử lại.'
      );
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
      form.setValue('imageUrl', previewUrl, { shouldValidate: true });
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
      form.setError('imageUrl', { message });
      return null;
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue('imageUrl', classItem?.imageUrl || '', { shouldValidate: true });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {successMessage && (
              <Alert className="border-primary/20 bg-primary/10">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {generalError && (
              <Alert variant="destructive">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái: Thông tin lớp học */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên lớp học *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên lớp học" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mô tả <span className="text-muted-foreground text-sm">(Tùy chọn)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Mô tả chi tiết về lớp học"
                          rows={3}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VNĐ) *</FormLabel>
                      <FormControl>
                        <Input
                          value={
                            field.value ? new Intl.NumberFormat('de-DE').format(field.value) : ''
                          }
                          onChange={e => {
                            const cleanValue = e.target.value.replace(/[^\d]/g, '');
                            const numericValue = cleanValue ? parseInt(cleanValue, 10) : 0;
                            field.onChange(numericValue);
                          }}
                          placeholder="Nhập giá lớp học"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Giảm giá (%){' '}
                          <span className="text-muted-foreground text-sm">(Tùy chọn)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field.value || ''}
                            onChange={e => {
                              const filteredValue = e.target.value.replace(/[^\d]/g, '');
                              const numericValue = filteredValue ? parseInt(filteredValue, 10) : 0;
                              const limitedValue = Math.min(100, Math.max(0, numericValue));
                              field.onChange(limitedValue);
                            }}
                            placeholder="Nhập % giảm giá"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Thời gian kết thúc{' '}
                          <span className="text-muted-foreground text-sm">(Tùy chọn)</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Ngày kết thúc giảm giá"
                            disabled={isLoading}
                            fromDate={new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể loại *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="text-foreground">
                            <SelectValue placeholder="Chọn thể loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-foreground">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Lớp học nổi bật</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Hiển thị lớp học</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Cột phải: Upload và xem trước ảnh */}
              <div className="space-y-4 flex flex-col items-center justify-start">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel>Ảnh lớp học</FormLabel>
                      <div className="space-y-3">
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

                        {uploadProgress.isUploading && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Đang tải lên...</span>
                              <span>{uploadProgress.progress}%</span>
                            </div>
                            <Progress value={uploadProgress.progress} className="h-2" />
                          </div>
                        )}

                        {selectedFile && (
                          <div className="text-sm text-muted-foreground">
                            <p>Tệp đã chọn: {selectedFile.name}</p>
                            <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        )}

                        {imageUrl && (
                          <div className="mt-2 w-full flex flex-col items-center justify-center">
                            <img
                              src={imageUrl}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
        </Form>
      </DialogContent>

      {/* Dialog phóng to ảnh */}
      {imageUrl && (
        <PreviewDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <PreviewDialogContent className="max-w-4xl flex flex-col items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={imageUrl}
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
