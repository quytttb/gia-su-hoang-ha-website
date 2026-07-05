import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
  Calendar,
  Image,
  BarChart,
  User,
  Globe,
  FileText,
} from 'lucide-react';
import Logo from '../../shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { title: 'Tổng quan', href: '/panel', icon: LayoutDashboard },
  { title: 'Banner', href: '/panel/banners', icon: Image },
  { title: 'Giáo viên', href: '/panel/tutors', icon: Users },
  { title: 'Lớp học', href: '/panel/classes', icon: BookOpen },
  { title: 'Blog', href: '/panel/blog-posts', icon: FileText },
  { title: 'Lịch học', href: '/panel/schedules', icon: Calendar },
  { title: 'Đăng ký', href: '/panel/registrations', icon: Users },
  { title: 'Tin nhắn', href: '/panel/inquiries', icon: MessageSquare },
  { title: 'Nhân viên', href: '/panel/staff', icon: User, adminOnly: true },
  { title: 'Thống kê', href: '/panel/analytics', icon: BarChart },
  { title: 'Cài đặt', href: '/panel/settings', icon: Settings, adminOnly: true },
];

const PanelSidebar = () => {
  const pathname = usePathname() ?? '/panel';
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item => !item.adminOnly || user?.role === 'admin');

  const isActive = (href: string) =>
    href === '/panel' ? pathname === '/panel' : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1">
          <Logo variant="icon" size="sm" linkTo="/panel" />
          <span className="font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            Bảng điều khiển
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Button asChild className="w-full min-h-12" variant="default">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Globe className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Xem Website</span>
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
          Gia Sư Hoàng Hà © 2025
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default PanelSidebar;
