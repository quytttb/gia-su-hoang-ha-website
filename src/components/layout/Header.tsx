'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DropdownItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdown?: DropdownItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Trang chủ', href: '/' },
  {
    name: 'Về chúng tôi',
    href: '/about',
    hasDropdown: true,
    dropdown: [
      { name: 'Giới thiệu trung tâm', href: '/about#about-intro' },
      { name: 'Lịch sử phát triển', href: '/about#history-founder' },
      { name: 'Tầm nhìn', href: '/about#vision' },
      { name: 'Sứ mệnh', href: '/about#mission' },
      { name: 'Dịch vụ cung cấp', href: '/about#services' },
      { name: 'Đội ngũ giáo viên', href: '/about#team' },
      { name: 'Hình ảnh thực tế', href: '/about#gallery' },
      { name: 'Thư ngỏ', href: '/about#letter' },
    ],
  },
  { name: 'Lớp học', href: '/classes' },
  { name: 'Gia sư', href: '/tutor-search' },
  { name: 'Lịch học', href: '/schedule' },
  {
    name: 'Blog',
    href: '/blog',
    hasDropdown: true,
    dropdown: [
      { name: 'Tất cả bài viết', href: '/blog' },
      { name: 'Bài viết nổi bật', href: '/blog#featured-posts' },
      { name: 'Chủ đề', href: '/blog#categories' },
      { name: 'Tìm kiếm', href: '/blog#search-filter' },
      { name: 'Bài viết mới nhất', href: '/blog#latest-posts' },
    ],
  },
  { name: 'Liên hệ', href: '/contact' },
];

const navLinkClass = (active: boolean) =>
  cn(
    'px-3 py-2 rounded-full font-medium transition-all duration-200',
    active
      ? 'bg-primary text-primary-foreground shadow-lg'
      : 'text-foreground hover:text-primary hover:bg-primary/10'
  );

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  const handleSectionClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();

    if (href.includes('#')) {
      const [path, sectionId] = href.split('#');

      if (pathname === path) {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = 80;
          window.scrollTo({ top: element.offsetTop - headerHeight, behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }

    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background border-b border-border shadow-sm transition-colors duration-200">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3 md:py-4">
          <Logo variant="text" size="lg" />

          <nav className="hidden md:flex space-x-2 items-center">
            {navigation.map(item =>
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(navLinkClass(isActive(item.href)), 'flex items-center gap-1')}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {item.dropdown?.map(dropdownItem => (
                      <DropdownMenuItem key={dropdownItem.name} asChild>
                        <Link
                          href={dropdownItem.href}
                          onClick={e => handleSectionClick(dropdownItem.href, e)}
                        >
                          {dropdownItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={navLinkClass(isActive(item.href))}
                >
                  {item.name}
                </Link>
              )
            )}
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Mở menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-1" id="mobile-navigation">
                  {navigation.map(item => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                          isActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.dropdown?.map(dropdownItem => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={e => handleSectionClick(dropdownItem.href, e)}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
