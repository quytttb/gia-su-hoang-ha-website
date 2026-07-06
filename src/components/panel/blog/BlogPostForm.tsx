import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { createPost, updatePost } from '@/actions/blog';
import { uploadFile } from '@/actions/upload';

type UploadProgress = {
  progress: number;
  isUploading: boolean;
};

const computeReadTime = (markdown: string): number => {
  const words = markdown
    .replace(/[#*_`>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
};
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Loader2, Upload, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../utils/cropImage';
import { Dialog as CropDialog, DialogContent as CropDialogContent } from '../../ui/dialog';
import { blogPostFormSchema, type BlogPostFormValues } from '@/lib/validations/panel';

interface BlogPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  post?: any; // future: BlogPost
  categories: { id: string; name: string }[];
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({
  isOpen,
  onClose,
  onSaved,
  post,
  categories,
}) => {
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      contentMarkdown: '',
      categoryId: '',
      tagsInput: '',
      featured: false,
      status: 'draft',
      coverImage: '',
    },
  });
  const title = form.watch('title');
  const subtitle = form.watch('subtitle');
  const contentMarkdown = form.watch('contentMarkdown');
  const categoryId = form.watch('categoryId');
  const tagsInput = form.watch('tagsInput');
  const featured = form.watch('featured');
  const status = form.watch('status');
  const coverImage = form.watch('coverImage') || '';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null);
  const [uploading, setUploading] = useState<UploadProgress>({ progress: 0, isUploading: false });
  const [contentUploading, setContentUploading] = useState<UploadProgress>({
    progress: 0,
    isUploading: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track newly uploaded (unsaved) cover image for cleanup if user cancels
  const [tempUploadedCoverUrl, setTempUploadedCoverUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { reset } = form;

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        subtitle: post.subtitle || '',
        contentMarkdown: post.contentMarkdown || '',
        categoryId: post.categoryId || '',
        tagsInput: (post.tags || []).join(', '),
        featured: !!post.featured,
        status: post.status || 'draft',
        coverImage: post.coverImage?.url || '',
      });
    } else if (isOpen) {
      reset({
        title: '',
        subtitle: '',
        contentMarkdown: '',
        categoryId: '',
        tagsInput: '',
        featured: false,
        status: 'draft',
        coverImage: '',
      });
      setError(null);
    }
    // Reset temp tracking on open
    if (isOpen) {
      setTempUploadedCoverUrl(null);
      setSaved(false);
    }
  }, [post, isOpen, reset]);

  useEffect(() => {
    return () => {
      if (!saved && tempUploadedCoverUrl && tempUploadedCoverUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempUploadedCoverUrl);
      }
    };
  }, [saved, tempUploadedCoverUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCropImage(previewUrl);
    setShowCrop(true);
  };

  const onCropComplete = (_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels || !selectedFile) return;
    try {
      const blob = await getCroppedImg(cropImage, croppedAreaPixels);
      const fileName = selectedFile.name.replace(/\.[^.]+$/, '') + '-cropped.jpg';
      const croppedFile = new File([blob], fileName, { type: blob.type });
      // Upload cropped file
      const uploadFormData = new FormData();
      uploadFormData.append('file', croppedFile);
      setUploading({ progress: 0, isUploading: true });
      const result = await uploadFile(uploadFormData, 'blog-covers');
      setUploading({ progress: 100, isUploading: false });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Lỗi upload ảnh bìa');
      }

      form.setValue('coverImage', result.data.url);
      setTempUploadedCoverUrl(result.data.url);
      setSaved(false);
      setShowCrop(false);
    } catch (e: unknown) {
      setUploading({ progress: 0, isUploading: false });
      const message = e instanceof Error ? e.message : 'Lỗi cắt ảnh';
      setError(message);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('coverImage', '');
    setSelectedFile(null);
  };

  // Insert image into markdown content at current cursor position
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertTextAtCursor = (textToInsert: string) => {
    const el = contentTextareaRef.current;
    const current = form.getValues('contentMarkdown');
    if (!el) {
      form.setValue('contentMarkdown', current + textToInsert);
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const before = current.slice(0, start);
    const after = current.slice(end);
    const next = `${before}${textToInsert}${after}`;
    form.setValue('contentMarkdown', next);
    // restore caret after inserted text
    const nextPos = start + textToInsert.length;
    requestAnimationFrame(() => {
      try {
        el.focus();
        el.setSelectionRange(nextPos, nextPos);
      } catch {
        // ignore caret restore errors in unsupported environments
      }
    });
  };

  const onContentImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // reset value to allow re-selecting same file next time
    e.currentTarget.value = '';
    if (!file) return;
    try {
      setError(null);
      setContentUploading({ progress: 0, isUploading: true });
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const result = await uploadFile(uploadFormData, 'gallery');
      setContentUploading({ progress: 100, isUploading: false });

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Lỗi tải ảnh nội dung');
      }

      const alt = (file.name || 'image').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      const md = `\n\n![${alt}](${result.data.url})\n\n`;
      insertTextAtCursor(md);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi tải ảnh nội dung';
      setError(message);
    } finally {
      setContentUploading({ progress: 0, isUploading: false });
    }
  };

  const tags = (tagsInput || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  const readTime = computeReadTime(contentMarkdown);

  let rawPreview = marked.parse(contentMarkdown || '') as any;
  if (rawPreview instanceof Promise) {
    // Should not normally happen in this config; fallback empty
    rawPreview = '';
  }
  const previewHtml = DOMPurify.sanitize(rawPreview as string);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await form.trigger();
    if (!valid) {
      const firstError = Object.values(form.formState.errors)[0]?.message;
      setError(typeof firstError === 'string' ? firstError : 'Vui lòng kiểm tra lại form');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (post) {
        const result = await updatePost(post.id, {
          title,
          subtitle,
          contentMarkdown,
          categoryId,
          tags,
          featured,
          status,
          coverImageUrl: coverImage || undefined,
        });
        if (!result.success) {
          throw new Error(result.error ?? 'Không thể cập nhật bài viết');
        }
      } else {
        const result = await createPost({
          title,
          subtitle,
          contentMarkdown,
          categoryId,
          tags,
          featured,
          status,
          authorName: 'Admin',
          coverImageUrl: coverImage || undefined,
        });
        if (!result.success) {
          throw new Error(result.error ?? 'Không thể tạo bài viết');
        }
      }
      setSaved(true);
      onSaved();
      onClose();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Lỗi lưu bài viết';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>{post ? 'Chỉnh sửa bài viết' : 'Bài viết mới'}</DialogTitle>
          <DialogDescription>Nhập thông tin bài viết blog</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Tiêu đề</Label>
                <Input
                  value={title}
                  onChange={e => form.setValue('title', e.target.value, { shouldValidate: true })}
                  placeholder="Tiêu đề..."
                />
              </div>
              <div>
                <Label>Phụ đề</Label>
                <Input
                  value={subtitle}
                  onChange={e => form.setValue('subtitle', e.target.value)}
                  placeholder="Phụ đề..."
                />
              </div>
              <div>
                <Label>Chủ đề</Label>
                <Select
                  value={categoryId}
                  onValueChange={v => form.setValue('categoryId', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  value={tagsInput}
                  onChange={e => form.setValue('tagsInput', e.target.value)}
                  placeholder="toán, văn, ôn thi"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={featured} onCheckedChange={v => form.setValue('featured', v)} />
                  <Label>Nổi bật</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={status === 'published'}
                    onCheckedChange={c => form.setValue('status', c ? 'published' : 'draft')}
                  />
                  <Label>Xuất bản</Label>
                </div>
              </div>
              <div>
                <Label>Ảnh bìa</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="blogCoverInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('blogCoverInput')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> {coverImage ? 'Đổi ảnh' : 'Chọn ảnh'}
                  </Button>
                  {coverImage && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {uploading.isUploading && (
                  <div className="mt-1 text-xs">Đang upload {uploading.progress}%</div>
                )}
                {coverImage && (
                  <div className="mt-2">
                    <img
                      src={coverImage}
                      alt="cover"
                      className="h-32 w-auto object-contain rounded border cursor-zoom-in"
                    />
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Thời gian đọc ước tính: {readTime} phút
              </div>
            </div>
            <div className="flex flex-col">
              <Label>Nội dung (Markdown)</Label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="blogContentImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onContentImageSelected}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('blogContentImageInput')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Chèn ảnh
                </Button>
                {contentUploading.isUploading && (
                  <span className="text-xs text-muted-foreground">
                    Đang tải {contentUploading.progress}%
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Hỗ trợ Markdown: <code className="font-mono bg-muted px-1 rounded">**đậm**</code>,
                <code className="font-mono bg-muted px-1 rounded ml-1">*nghiêng*</code>,
                <code className="font-mono bg-muted px-1 rounded ml-1">- danh sách</code>,
                <code className="font-mono bg-muted px-1 rounded ml-1">[link](https://...)</code>,
                <code className="font-mono bg-muted px-1 rounded ml-1">![alt](url)</code>. Nhấn
                "Chèn ảnh" để tải ảnh và tự chèn cú pháp vào vị trí con trỏ.
              </div>
              <Textarea
                value={contentMarkdown}
                onChange={e =>
                  form.setValue('contentMarkdown', e.target.value, { shouldValidate: true })
                }
                ref={contentTextareaRef}
                placeholder="Viết nội dung bằng Markdown...\nVí dụ: # Tiêu đề chính\n\nĐoạn văn...\n\n- Gạch đầu dòng 1\n- Gạch đầu dòng 2"
                className="flex-1 min-h-[300px] font-mono text-sm text-black dark:text-white"
              />
            </div>
          </div>
          <div>
            <Label>Xem trước</Label>
            <div
              className="prose dark:prose-invert max-w-none border rounded p-4 h-64 overflow-y-auto text-black dark:text-white"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Lưu
            </Button>
          </DialogFooter>
          {/* Crop Dialog */}
          {showCrop && (
            <CropDialog open={showCrop} onOpenChange={setShowCrop}>
              <CropDialogContent className="max-w-2xl">
                <div className="relative w-full h-80 bg-black">
                  {cropImage && (
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="zoomRange" className="text-sm">
                      Zoom
                    </Label>
                    <input
                      id="zoomRange"
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={e => setZoom(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs w-10 text-right">{zoom.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCrop(false)}>
                      Hủy
                    </Button>
                    <Button type="button" onClick={handleCropSave}>
                      Cắt & tải lên
                    </Button>
                  </div>
                </div>
              </CropDialogContent>
            </CropDialog>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
