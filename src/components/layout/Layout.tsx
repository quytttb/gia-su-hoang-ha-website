'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname() ?? '/';
  const isContactPage = pathname === '/contact';
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
      >
        Bỏ qua đến nội dung chính
      </a>
      <Header />
      <main
        id="main-content"
        className={`flex-grow page-transition relative z-10 pt-28 ${isHomePage ? 'pb-0' : 'pb-16'}`}
      >
        {children}
      </main>
      <Footer isContactPage={isContactPage} />
    </div>
  );
};

export default Layout;
