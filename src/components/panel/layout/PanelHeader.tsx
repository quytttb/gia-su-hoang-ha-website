import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Bell, Settings, LogOut, User, Moon, Sun, Mail, Clock, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeStore } from '@/stores/useThemeStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../../ui/dropdown-menu';

interface PanelHeaderProps {
  className?: string;
}

const routeTitles: Record<string, string> = {
  '/panel': 'Tổng quan',
  '/panel/classes': 'Quản lý Lớp học',
  '/panel/schedules': 'Quản lý Lịch học',
  '/panel/registrations': 'Quản lý Đăng ký',
  '/panel/inquiries': 'Quản lý Tin nhắn',
  '/panel/banners': 'Quản lý Banner',
  '/panel/staff': 'Quản lý Nhân viên',
  '/panel/analytics': 'Thống kê',
  '/panel/settings': 'Cài đặt Hệ thống',
};

const PanelHeader: React.FC<PanelHeaderProps> = ({ className }) => {
  const { user, signOut } = useAuth();
  const resolvedTheme = useThemeStore(state => state.resolvedTheme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const router = useRouter();
  const pathname = usePathname() ?? '/panel';
  const newMessagesCount = useNotificationStore(state => state.newMessagesCount);
  const recentMessages = useNotificationStore(state => state.recentMessages);

  const currentTitle = routeTitles[pathname] || 'Dashboard';

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationClick = (messageId?: string) => {
    if (messageId) {
      router.push(`/panel/inquiries?messageId=${messageId}`);
    } else {
      router.push('/panel/inquiries');
    }
  };

  const formatMessagePreview = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  return (
    <div className={cn('flex flex-1 items-center justify-between', className)}>
      <h1 className="text-xl font-semibold text-foreground">{currentTitle}</h1>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          title="Làm mới dữ liệu"
          onClick={() => window.dispatchEvent(new CustomEvent('panel-global-refresh'))}
        >
          <RefreshCcw className="h-5 w-5 text-foreground" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" title="Thông báo">
              <Bell className="h-5 w-5 text-foreground" />
              {newMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {newMessagesCount > 9 ? '9+' : newMessagesCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Thông báo</span>
              {newMessagesCount > 0 && (
                <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
                  {newMessagesCount} mới
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {recentMessages.length > 0 ? (
              <>
                {recentMessages.map(message => (
                  <DropdownMenuItem
                    key={message.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => handleNotificationClick(message.id)}
                  >
                    <div className="flex items-center w-full mb-1">
                      <Mail className="h-4 w-4 text-primary mr-2" />
                      <span className="font-medium text-sm">{message.name}</span>
                      <Clock className="h-3 w-3 text-muted-foreground ml-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {formatMessagePreview(message.message)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(message.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-primary"
                  onClick={() => handleNotificationClick()}
                >
                  Xem tất cả tin nhắn
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không có tin nhắn mới</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || 'Quản trị viên'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'admin'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PanelHeader;
