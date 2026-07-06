import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import Loading from '../shared/Loading';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-muted">
          <Card className="max-w-md w-full p-6 text-center">
            <CardContent className="p-0 space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Không có quyền truy cập</AlertTitle>
                <AlertDescription>
                  Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn
                  cho rằng đây là lỗi.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Vai trò hiện tại:</strong> {getRoleDisplayName(user.role)}
                </p>
                <p>
                  <strong>Vai trò yêu cầu:</strong>{' '}
                  {requiredRoles.map(getRoleDisplayName).join(', ')}
                </p>
              </div>
              <Button onClick={() => window.history.back()}>Quay lại</Button>
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
        <div className="min-h-screen flex items-center justify-center bg-muted">
          <Card className="max-w-md w-full p-6 text-center">
            <CardContent className="p-0 space-y-4">
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Thiếu quyền hạn</AlertTitle>
                <AlertDescription>
                  Bạn không có đủ quyền hạn để truy cập tính năng này.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm text-muted-foreground text-left">
                <p>
                  <strong>Quyền hạn thiếu:</strong>
                </p>
                <ul className="list-disc list-inside">
                  {missingPermissions.map(permission => (
                    <li key={permission}>{getPermissionDisplayName(permission)}</li>
                  ))}
                </ul>
              </div>
              <Button onClick={() => window.history.back()}>Quay lại</Button>
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
