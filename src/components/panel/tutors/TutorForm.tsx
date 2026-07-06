import React, { useState, useEffect, useRef } from 'react';
import { Tutor } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
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
import { uploadFile } from '@/actions/upload';

type UploadProgress = {
  progress: number;
  isUploading: boolean;
};
import { tutorFormSchema } from '@/lib/validations/panel';
import { mapZodErrors } from '@/lib/validations/zodHelpers';

interface TutorFormProps {
  tutor?: Tutor;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutor: Omit<Tutor, 'id'>) => Promise<void>;
}

const TutorForm: React.FC<TutorFormProps> = ({ tutor, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Tutor, 'id'>>({
    name: '',
    specialty: '',
    bio: '',
    imageUrl: '',
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

  useEffect(() => {
    if (tutor) {
      setFormData({
        name: tutor.name,
        specialty: tutor.specialty,
        bio: tutor.bio,
        imageUrl: tutor.imageUrl,
      });
    } else {
      setFormData({ name: '', specialty: '', bio: '', imageUrl: '' });
    }
    setErrors({});
    setSelectedFile(null);
    setUploadProgress({ progress: 0, isUploading: false });
    setIsSubmitting(false);
    setSuccessMessage(null);
  }, [tutor, isOpen]);

  const validateForm = () => {
    const result = tutorFormSchema.safeParse(formData);
    const newErrors = result.success ? {} : mapZodErrors(result.error);
    if (!formData.bio.trim()) newErrors.bio = 'Giới thiệu là bắt buộc';
    if (!formData.imageUrl.trim() && !selectedFile)
      newErrors.imageUrl = 'Ảnh giáo viên là bắt buộc';
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
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        finalImageUrl = uploadedUrl;
      }
      await onSave({ ...formData, imageUrl: finalImageUrl });
      setSuccessMessage(tutor ? 'Đã cập nhật giáo viên!' : 'Đã thêm giáo viên mới!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message || 'Có lỗi xảy ra khi lưu giáo viên' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
    if (successMessage) setSuccessMessage(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: previewUrl }));
      if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    try {
      setUploadProgress({ progress: 0, isUploading: true });
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      const result = await uploadFile(formDataUpload, 'tutors');
      setUploadProgress({ progress: 100, isUploading: false });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Lỗi upload hình ảnh');
      }

      setFormData(prev => ({ ...prev, imageUrl: result.data!.url }));
      return result.data.url;
    } catch (error: unknown) {
      setUploadProgress({ progress: 0, isUploading: false });
      const message = error instanceof Error ? error.message : 'Lỗi upload hình ảnh';
      setErrors(prev => ({ ...prev, imageUrl: message }));
      return null;
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, imageUrl: tutor?.imageUrl || '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLoading = uploadProgress.isUploading || isSubmitting;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-[700px] max-w-2xl">
          <DialogHeader>
            <DialogTitle>{tutor ? 'Chỉnh sửa Giáo viên' : 'Thêm Giáo viên mới'}</DialogTitle>
            <DialogDescription>
              {tutor ? 'Cập nhật thông tin giáo viên.' : 'Thêm giáo viên mới cho trung tâm.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
              </div>
            )}
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên giáo viên *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Nhập tên giáo viên"
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Chuyên môn *</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={e => handleInputChange('specialty', e.target.value)}
                    placeholder="Nhập chuyên môn (Toán, Văn, Anh, ... )"
                    className={errors.specialty ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.specialty && (
                    <p className="text-sm text-destructive">{errors.specialty}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu *</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    placeholder="Giới thiệu ngắn về giáo viên"
                    rows={4}
                    className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ${errors.bio ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                </div>
              </div>
              <div className="space-y-4 flex flex-col items-center justify-start">
                <div className="w-full space-y-2">
                  <Label htmlFor="imageFile">Ảnh giáo viên *</Label>
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="text-sm text-muted-foreground">
                        <p>Tệp đã chọn: {selectedFile.name}</p>
                        <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}
                    {errors.imageUrl && (
                      <p className="text-sm text-destructive">{errors.imageUrl}</p>
                    )}
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
                    : tutor
                      ? 'Cập nhật'
                      : 'Thêm mới'}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
              alt="Phóng to ảnh giáo viên"
              className="max-h-[90vh] w-auto max-w-full object-contain rounded-md border"
            />
          </PreviewDialogContent>
        </PreviewDialog>
      )}
    </>
  );
};

export default TutorForm;
