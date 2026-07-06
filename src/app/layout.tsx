import type { Metadata } from 'next';
import Script from 'next/script';
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

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('gia-su-theme');
    var theme = stored ? JSON.parse(stored).state.theme : 'system';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();
`;

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="vi" suppressHydrationWarning>
    <head>
      <Script id="theme-init" strategy="beforeInteractive">
        {themeScript}
      </Script>
    </head>
    <body className={roboto.variable}>
      <AppProviders>{children}</AppProviders>
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
