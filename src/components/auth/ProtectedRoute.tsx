import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import Loading from '../shared/Loading';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = '/login',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace(`${fallbackPath}?from=${encodeURIComponent(pathname ?? '/')}`);
    }
  }, [fallbackPath, loading, pathname, router, user]);

  // Show loading while checking authentication
  if (loading) {
    return <Loading message="Đang kiểm tra quyền truy cập..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full p-6 text-center">
            <CardContent className="p-0">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Không có quyền truy cập
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn
                cho rằng đây là lỗi.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Vai trò hiện tại:</strong> {getRoleDisplayName(user.role)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Vai trò yêu cầu:</strong>{' '}
                  {requiredRoles.map(getRoleDisplayName).join(', ')}
                </p>
              </div>
              <div className="mt-6">
                <Button onClick={() => window.history.back()}>Quay lại</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        permission => !user.permissions?.includes(permission)
      );

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full p-6 text-center">
            <CardContent className="p-0">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Thiếu quyền hạn
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bạn không có đủ quyền hạn để truy cập tính năng này.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Quyền hạn thiếu:</strong>
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                  {missingPermissions.map(permission => (
                    <li key={permission}>{getPermissionDisplayName(permission)}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Button onClick={() => window.history.back()}>Quay lại</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // User has required access, render children
  return <>{children}</>;
};

// Helper function to get role display name
const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'staff':
      return 'Nhân viên';
    case 'user':
      return 'Người dùng';
    default:
      return role;
  }
};

// Helper function to get permission display name
const getPermissionDisplayName = (permission: string): string => {
  const permissionNames: Record<string, string> = {
    view_courses: 'Xem lớp học',
    create_course: 'Tạo lớp học',
    edit_course: 'Chỉnh sửa lớp học',
    delete_course: 'Xóa lớp học',
    view_registrations: 'Xem đăng ký',
    approve_registration: 'Duyệt đăng ký',
    cancel_registration: 'Hủy đăng ký',
    view_inquiries: 'Xem tin nhắn',
    respond_inquiry: 'Trả lời tin nhắn',
    resolve_inquiry: 'Giải quyết tin nhắn',
    view_schedules: 'Xem lịch học',
    create_schedule: 'Tạo lịch học',
    edit_schedule: 'Chỉnh sửa lịch học',
    delete_schedule: 'Xóa lịch học',
    view_users: 'Xem người dùng',
    create_user: 'Tạo người dùng',
    edit_user: 'Chỉnh sửa người dùng',
    delete_user: 'Xóa người dùng',
    view_analytics: 'Xem thống kê',
    export_data: 'Xuất dữ liệu',
    manage_settings: 'Quản lý cài đặt',
    view_logs: 'Xem nhật ký',
  };

  return permissionNames[permission] || permission;
};

export default ProtectedRoute;
