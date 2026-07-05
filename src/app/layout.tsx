import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://giasuhoangha.com'),
  title: {
    default: 'Trung tâm Gia Sư Hoàng Hà',
    template: '%s | Trung tâm Gia Sư Hoàng Hà',
  },
  description: 'Trung tâm Gia Sư Hoàng Hà cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="vi" suppressHydrationWarning>
    <body className={roboto.variable}>
      <AppProviders>{children}</AppProviders>
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
