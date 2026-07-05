import React, { useState, useEffect } from 'react';
import { UploadService } from '../../services/uploadService';
import { CheckCircle, AlertCircle, Upload, Settings, Trash2 } from 'lucide-react';

interface ServiceStatus {
  cloudinary: boolean;
  configured: boolean;
}

const UploadServiceStatus: React.FC = () => {
  const [status, setStatus] = useState<ServiceStatus>({
    cloudinary: false,
    configured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Thêm các state cho tính năng xóa ảnh
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const serviceStatus = UploadService.getServiceStatus();
    setStatus(serviceStatus);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError(null);

    try {
      const result = await UploadService.uploadBannerImage(file, progress => {
        setUploadProgress(progress.progress);
        if (progress.error) {
          setUploadError(progress.error);
        }
      });

      setUploadResult(result.url);
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Xử lý xóa ảnh
  const handleDeleteImage = async () => {
    if (!uploadResult) return;

    // Reset states
    setIsDeleting(true);
    setDeleteSuccess(null);
    setDeleteError(null);

    try {
      await UploadService.deleteFile(uploadResult);
      setDeleteSuccess('Ảnh đã được xóa thành công khỏi Cloudinary!');
      // Xóa ảnh khỏi kết quả
      setUploadResult(null);
    } catch (error: any) {
      setDeleteError(error.message || 'Không thể xóa ảnh. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const StatusIcon: React.FC<{ active: boolean }> = ({ active }) => {
    return active ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upload Service Status
        </h3>
      </div>

      {/* Service Status */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <StatusIcon active={status.cloudinary} />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Cloudinary</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                10GB miễn phí, tối ưu ảnh tự động
              </div>
            </div>
          </div>
          {status.configured && (
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
              ✓ Hoạt động
            </span>
          )}
        </div>
      </div>

      {/* Configuration Status */}
      {!status.configured && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              Cấu hình chưa đầy đủ
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Cloudinary chưa được cấu hình. Vui lòng thiết lập:
          </p>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</li>
            <li>• NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</li>
          </ul>
        </div>
      )}

      {/* Upload Test */}
      {status.configured && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
            Test Upload (Cloudinary)
          </h4>

          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-200
                  dark:hover:file:bg-blue-800
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {isUploading && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Uploading... {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadResult && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Upload thành công!
                  </span>
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 break-all mb-2">
                  {uploadResult}
                </div>
                <div className="relative">
                  <img
                    src={uploadResult}
                    alt="Uploaded"
                    className="max-w-xs max-h-32 object-contain rounded border"
                  />
                  <button
                    onClick={handleDeleteImage}
                    disabled={isDeleting}
                    className="mt-2 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    {isDeleting ? (
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    {isDeleting ? 'Đang xóa...' : 'Xóa ảnh này'}
                  </button>
                </div>
              </div>
            )}

            {/* Thông báo kết quả xóa ảnh */}
            {deleteSuccess && !uploadResult && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">{deleteSuccess}</span>
                </div>
              </div>
            )}

            {deleteError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Xóa ảnh thất bại
                  </span>
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">{deleteError}</div>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Upload thất bại
                  </span>
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">{uploadError}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadServiceStatus;
