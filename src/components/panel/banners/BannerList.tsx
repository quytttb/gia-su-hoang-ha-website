import React, { useState } from 'react';
import { Banner } from '../../../types';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Edit, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react';

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (bannerId: string) => void;
  onToggleActive: (bannerId: string, isActive: boolean) => void;
  onReorder: (banners: Banner[]) => void;
}

const BannerList: React.FC<BannerListProps> = ({
  banners,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    banner: Banner | null;
  }>({
    isOpen: false,
    banner: null,
  });

  const [draggedItem, setDraggedItem] = useState<Banner | null>(null);

  const handleDeleteClick = (banner: Banner) => {
    setDeleteConfirm({
      isOpen: true,
      banner,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.banner) {
      onDelete(deleteConfirm.banner.id);
      setDeleteConfirm({
        isOpen: false,
        banner: null,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, banner: Banner) => {
    setDraggedItem(banner);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBanner: Banner) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetBanner.id) {
      setDraggedItem(null);
      return;
    }

    const newBanners = [...banners];
    const draggedIndex = newBanners.findIndex(b => b.id === draggedItem.id);
    const targetIndex = newBanners.findIndex(b => b.id === targetBanner.id);

    // Remove dragged item and insert at target position
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(targetIndex, 0, draggedItem);

    // Update order values
    const reorderedBanners = newBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
    }));

    onReorder(reorderedBanners);
    setDraggedItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có banner nào được tạo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left font-semibold text-foreground">Thứ tự</th>
            <th className="p-3 text-left font-semibold text-foreground">Hình ảnh</th>
            <th className="p-3 text-left font-semibold text-foreground">Tiêu đề</th>
            <th className="p-3 text-left font-semibold text-foreground">Trạng thái</th>
            <th className="p-3 text-left font-semibold text-foreground">Cập nhật</th>
            <th className="p-3 text-left font-semibold text-foreground">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {banners
            .sort((a, b) => a.order - b.order)
            .map(banner => (
              <tr
                key={banner.id}
                className="border-b last:border-0 hover:bg-accent/40 transition-colors"
                draggable
                onDragStart={e => handleDragStart(e, banner)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, banner)}
              >
                <td className="p-3 align-middle">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <span className="font-medium text-foreground">{banner.order}</span>
                  </div>
                </td>
                <td className="p-3 align-middle">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-16 h-10 object-cover rounded border"
                    onError={e => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </td>
                <td className="p-3 align-middle">
                  <div>
                    <p className="font-semibold text-foreground text-base line-clamp-2">
                      {banner.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                    {banner.link && (
                      <div className="flex items-center mt-1">
                        <ExternalLink className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{banner.link}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 align-middle">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={checked => onToggleActive(banner.id, checked)}
                    />
                    {banner.isActive ? (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-green-600 text-white dark:bg-green-700 dark:text-white font-semibold">
                        <Eye className="h-4 w-4 mr-1 inline" /> Hiển thị
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 dark:bg-gray-600 dark:text-gray-100 font-semibold">
                        <EyeOff className="h-4 w-4 mr-1 inline" /> Ẩn
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 align-middle text-muted-foreground">
                  {banner.updatedAt ? formatDate(banner.updatedAt) : '-'}
                </td>
                <td className="p-3 align-middle space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-foreground"
                    onClick={() => onEdit(banner)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Sửa
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(banner)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Xóa
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Xác nhận xóa */}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={open => setDeleteConfirm({ isOpen: open, banner: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa banner</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa banner này không?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, banner: null })}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerList;
