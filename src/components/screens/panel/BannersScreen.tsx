import React, { useState, useEffect } from 'react';
import BannerForm from '@/components/panel/banners/BannerForm';
import BannerList from '@/components/panel/banners/BannerList';
import { Button } from '@/components/ui/button';
import { Banner } from '@/types';
import { getAllBanners } from '@/data/banners';
import { createBanner, updateBanner, deleteBanner, reorderBanners } from '@/actions/banner';
import { Plus, Image } from 'lucide-react';
import ErrorDisplay from '@/components/shared/ErrorDisplay';
import SkeletonLoading from '@/components/shared/SkeletonLoading';
import { Card, CardContent } from '@/components/ui/card';

const BannersScreen: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBanners();
      setBanners(data);
    } catch (err) {
      console.error('Error loading banners:', err);
      setError('Không thể tải danh sách banner. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
    const handler = () => loadBanners();
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, []);

  const handleCreateBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setActionLoading('create');
      const result = await createBanner(bannerData);
      if (!result.success) {
        setError(result.error ?? 'Không thể tạo banner. Vui lòng thử lại.');
        return;
      }
      await loadBanners();
    } catch (err) {
      console.error('Error creating banner:', err);
      setError('Không thể tạo banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleUpdateBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingBanner) return;

    try {
      setActionLoading('update');
      const result = await updateBanner(editingBanner.id, bannerData);
      if (!result.success) {
        setError(result.error ?? 'Không thể cập nhật banner. Vui lòng thử lại.');
        return;
      }
      await loadBanners();
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Không thể cập nhật banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      setActionLoading('delete');
      const result = await deleteBanner(bannerId);
      if (!result.success) {
        setError(result.error ?? 'Không thể xóa banner. Vui lòng thử lại.');
        return;
      }
      setBanners(prev => prev.filter(b => b.id !== bannerId));
    } catch (err) {
      console.error('Error deleting banner:', err);
      setError('Không thể xóa banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (bannerId: string, isActive: boolean) => {
    try {
      setActionLoading('toggle');
      const result = await updateBanner(bannerId, { isActive });
      if (!result.success) {
        setError(result.error ?? 'Không thể thay đổi trạng thái banner. Vui lòng thử lại.');
        return;
      }
      setBanners(prev => prev.map(b => (b.id === bannerId ? { ...b, isActive } : b)));
    } catch (err) {
      console.error('Error toggling banner status:', err);
      setError('Không thể thay đổi trạng thái banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorderBanners = async (reorderedBanners: Banner[]) => {
    try {
      setActionLoading('reorder');
      const result = await reorderBanners(reorderedBanners.map(b => b.id));
      if (!result.success || !result.data) {
        setError(result.error ?? 'Không thể sắp xếp lại banner. Vui lòng thử lại.');
        await loadBanners();
        return;
      }
      setBanners(
        result.data.map(b => ({
          id: b.id,
          imageUrl: b.imageUrl,
          title: b.title,
          subtitle: b.subtitle,
          link: b.link || undefined,
          isActive: b.isActive,
          order: b.order,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
        }))
      );
    } catch (err) {
      console.error('Error reordering banners:', err);
      setError('Không thể sắp xếp lại banner. Vui lòng thử lại.');
      await loadBanners();
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBanner(undefined);
  };

  const handleFormSave = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBanner) {
      await handleUpdateBanner(bannerData);
    } else {
      await handleCreateBanner(bannerData);
    }
  };

  const activeBannersCount = banners.filter(b => b.isActive).length;
  const totalBannersCount = banners.length;

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Banner</h2>
                <p className="text-muted-foreground">
                  Thêm, chỉnh sửa và quản lý banner hiển thị trên trang chủ.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={() => setIsFormOpen(true)} disabled={actionLoading !== null}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Banner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Tổng banner</p>
                  <p className="text-2xl font-bold text-foreground">{totalBannersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Đang hiển thị</p>
                  <p className="text-2xl font-bold text-foreground">{activeBannersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-muted rounded-lg">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Đang ẩn</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalBannersCount - activeBannersCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <ErrorDisplay message={error} onRetry={() => setError(null)} retryLabel="Thử lại" />
        )}

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <SkeletonLoading type="table-row" count={8} />
            </CardContent>
          </Card>
        ) : banners.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Image className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có banner nào</h3>
              <p className="text-muted-foreground mb-6">Bắt đầu bằng cách tạo banner mới</p>
              <Button onClick={() => setIsFormOpen(true)} disabled={actionLoading !== null}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Banner Mới
              </Button>
            </CardContent>
          </Card>
        ) : (
          <BannerList
            banners={banners}
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onToggleActive={handleToggleActive}
            onReorder={handleReorderBanners}
          />
        )}

        <BannerForm
          banner={editingBanner}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      </div>
    </>
  );
};

export default BannersScreen;
