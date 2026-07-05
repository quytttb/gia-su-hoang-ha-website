import React, { useState, useEffect } from 'react';
import BannerForm from '../../components/panel/banners/BannerForm';
import BannerList from '../../components/panel/banners/BannerList';
import { Button } from '../../components/ui/button';
import { Banner } from '../../types';
import { bannerService } from '../../services/bannerService';
import { Plus, RefreshCw, Image } from 'lucide-react';
import ErrorDisplay from '../../components/shared/ErrorDisplay';
import { UploadService } from '../../services/uploadService';
import SkeletonLoading from '../../components/shared/SkeletonLoading';
import { Card, CardContent } from '@/components/ui/card';

const BannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load banners
  const loadBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (err) {
      console.error('Error loading banners:', err);
      setError('Không thể tải danh sách banner. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize sample banners
  const initializeSampleBanners = async () => {
    try {
      setActionLoading('init');
      const sampleBanners = await bannerService.initializeSampleBanners();
      setBanners(sampleBanners);
      console.log('Sample banners initialized successfully');
    } catch (err) {
      console.error('Error initializing sample banners:', err);
      setError('Không thể khởi tạo banner mẫu. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    loadBanners();
    const handler = () => loadBanners();
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, []);

  // Handle create banner
  const handleCreateBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setActionLoading('create');

      // Get next order if not specified
      if (!bannerData.order) {
        const nextOrder = await bannerService.getNextOrder();
        bannerData.order = nextOrder;
      }

      const newBanner = await bannerService.createBanner(bannerData);
      setBanners(prev => [...prev, newBanner]);

      // Show success message (you can implement toast notifications)
      console.log('Banner created successfully');
    } catch (err) {
      console.error('Error creating banner:', err);
      setError('Không thể tạo banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle edit banner
  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  // Handle update banner
  const handleUpdateBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingBanner) return;

    try {
      setActionLoading('update');
      const updatedBanner = await bannerService.updateBanner(editingBanner.id, bannerData);
      setBanners(prev => prev.map(b => (b.id === updatedBanner.id ? updatedBanner : b)));

      console.log('Banner updated successfully');
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Không thể cập nhật banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete banner
  const handleDeleteBanner = async (bannerId: string) => {
    try {
      setActionLoading('delete');

      // Lấy thông tin banner trước khi xóa để có imageUrl
      const bannerToDelete = banners.find(b => b.id === bannerId);
      if (bannerToDelete && bannerToDelete.imageUrl) {
        try {
          // Xóa ảnh trên Cloudinary
          await UploadService.deleteFile(bannerToDelete.imageUrl);
          console.log('Banner image deleted from Cloudinary:', bannerToDelete.imageUrl);
        } catch (imageError) {
          // Log lỗi nhưng vẫn tiếp tục xóa banner trong database
          console.error('Error deleting banner image from Cloudinary:', imageError);
        }
      }

      // Xóa banner trong database
      await bannerService.deleteBanner(bannerId);
      setBanners(prev => prev.filter(b => b.id !== bannerId));

      console.log('Banner deleted successfully');
    } catch (err) {
      console.error('Error deleting banner:', err);
      setError('Không thể xóa banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (bannerId: string, isActive: boolean) => {
    try {
      setActionLoading('toggle');
      const updatedBanner = await bannerService.toggleBannerActive(bannerId, isActive);
      setBanners(prev => prev.map(b => (b.id === updatedBanner.id ? updatedBanner : b)));

      console.log(`Banner ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error toggling banner status:', err);
      setError('Không thể thay đổi trạng thái banner. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reorder banners
  const handleReorderBanners = async (reorderedBanners: Banner[]) => {
    try {
      setActionLoading('reorder');
      const updatedBanners = await bannerService.reorderBanners(reorderedBanners);
      setBanners(updatedBanners);

      console.log('Banners reordered successfully');
    } catch (err) {
      console.error('Error reordering banners:', err);
      setError('Không thể sắp xếp lại banner. Vui lòng thử lại.');
      // Reload to get correct order
      loadBanners();
    } finally {
      setActionLoading(null);
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBanner(undefined);
  };

  // Handle form save
  const handleFormSave = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBanner) {
      await handleUpdateBanner(bannerData);
    } else {
      await handleCreateBanner(bannerData);
    }
    // Form will close automatically on success
  };

  const activeBannersCount = banners.filter(b => b.isActive).length;
  const totalBannersCount = banners.length;

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
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

        {/* Stats */}
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <Image className="h-6 w-6 text-green-600" />
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
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Image className="h-6 w-6 text-gray-600" />
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

        {/* Error Display */}
        {error && (
          <ErrorDisplay message={error} onRetry={() => setError(null)} retryLabel="Thử lại" />
        )}

        {/* Banner List */}
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
              <p className="text-muted-foreground mb-6">
                Bắt đầu bằng cách tạo banner mới hoặc khởi tạo dữ liệu mẫu
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setIsFormOpen(true)} disabled={actionLoading !== null}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Banner Mới
                </Button>
                <Button
                  variant="outline"
                  onClick={initializeSampleBanners}
                  disabled={actionLoading !== null}
                  className="text-foreground"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${actionLoading === 'init' ? 'animate-spin' : ''}`}
                  />
                  Khởi Tạo Banner Mẫu
                </Button>
              </div>
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

        {/* Banner Form Modal */}
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

export default BannersPage;
