import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tutor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Dialog as PreviewDialog,
  DialogContent as PreviewDialogContent,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { uploadFile } from '@/actions/upload';
import { tutorFormSchema, type TutorFormValues } from '@/lib/validations/panel';

interface TutorFormProps {
  tutor?: Tutor;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutor: Omit<Tutor, 'id'>) => Promise<void>;
}

const TutorForm: React.FC<TutorFormProps> = ({ tutor, isOpen, onClose, onSave }) => {
  const [uploadProgress, setUploadProgress] = useState({ progress: 0, isUploading: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      name: '',
      specialty: '',
      bio: '',
      imageUrl: '',
      email: '',
      phone: '',
      isActive: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const imageUrl = form.watch('imageUrl');
  const isLoading = uploadProgress.isUploading || isSubmitting;

  useEffect(() => {
    if (!isOpen) return;
    if (tutor) {
      form.reset({
        name: tutor.name,
        specialty: tutor.specialty,
        bio: tutor.bio,
        imageUrl: tutor.imageUrl,
        email: '',
        phone: '',
        isActive: true,
      });
    } else {
      form.reset({
        name: '',
        specialty: '',
        bio: '',
        imageUrl: '',
        email: '',
        phone: '',
        isActive: true,
      });
    }
    setSelectedFile(null);
    setUploadProgress({ progress: 0, isUploading: false });
    setSuccessMessage(null);
    setGeneralError(null);
  }, [tutor, isOpen, form]);

  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return form.getValues('imageUrl') || null;
    try {
      setUploadProgress({ progress: 0, isUploading: true });
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      const result = await uploadFile(formDataUpload, 'tutors');
      setUploadProgress({ progress: 100, isUploading: false });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Lỗi upload hình ảnh');
      }

      form.setValue('imageUrl', result.data.url, { shouldValidate: true });
      return result.data.url;
    } catch (error: unknown) {
      setUploadProgress({ progress: 0, isUploading: false });
      const message = error instanceof Error ? error.message : 'Lỗi upload hình ảnh';
      form.setError('imageUrl', { message });
      return null;
    }
  };

  const onSubmit = async (values: TutorFormValues) => {
    setGeneralError(null);
    setSuccessMessage(null);
    try {
      let finalImageUrl = values.imageUrl;
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) return;
        finalImageUrl = uploadedUrl;
      }
      await onSave({
        name: values.name,
        specialty: values.specialty,
        bio: values.bio,
        imageUrl: finalImageUrl,
      });
      setSuccessMessage(tutor ? 'Đã cập nhật giáo viên!' : 'Đã thêm giáo viên mới!');
      setTimeout(onClose, 1500);
    } catch (error: unknown) {
      setGeneralError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu giáo viên');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('imageUrl', URL.createObjectURL(file), { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue('imageUrl', tutor?.imageUrl || '', { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {successMessage && (
                <Alert className="border-primary/20 bg-primary/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              {generalError && (
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên giáo viên *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập tên giáo viên" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chuyên môn *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Toán, Văn, Anh..." disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới thiệu *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Giới thiệu ngắn"
                            rows={4}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={() => (
                      <FormItem>
                        <FormLabel>Ảnh giáo viên *</FormLabel>
                        <div className="space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isLoading}
                          />
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isLoading}
                            >
                              {uploadProgress.isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {selectedFile ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                            </Button>
                            {selectedFile && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveFile}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {uploadProgress.isUploading && (
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress.progress}%` }}
                              />
                            </div>
                          )}
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="h-32 w-auto object-contain rounded-md border cursor-zoom-in"
                              onClick={() => setIsPreviewOpen(true)}
                            />
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading || !!successMessage}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {tutor ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
              alt="Phóng to"
              className="max-h-[90vh] object-contain rounded-md border"
            />
          </PreviewDialogContent>
        </PreviewDialog>
      )}
    </>
  );
};

export default TutorForm;
