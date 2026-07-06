import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import LazyIframe from '@/components/shared/LazyIframe';
import { CENTER_INFO } from '@/constants/centerInfo';
import { Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  isContactPage?: boolean;
}

const Footer = ({ isContactPage = false }: FooterProps) => {
  return (
    <footer className="bg-muted text-foreground pt-12 pb-6 border-t border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[400px_320px_1fr] gap-8">
          <div>
            <Logo variant="text" size="lg" linkTo="/" className="mb-4" />
            <p className="text-muted-foreground mb-6">Trung tâm gia sư uy tín tại Thanh Hóa</p>
            <p className="text-muted-foreground mb-6">
              Mang đến kiến thức và kỹ năng cho thế hệ trẻ
            </p>

            <div className="flex items-center space-x-4">
              <Link
                href={CENTER_INFO.facebookUrl}
                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/about', label: 'Về chúng tôi' },
                { href: '/classes', label: 'Khóa học' },
                { href: '/tutor-search', label: 'Tìm gia sư' },
                { href: '/schedule', label: 'Lịch học' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Liên hệ' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Liên hệ</h4>
            <address className="not-italic text-muted-foreground mb-6 space-y-3">
              <p className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span>{CENTER_INFO.address}</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary shrink-0" />
                <span>{CENTER_INFO.phonePrimary}</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary shrink-0" />
                <span>{CENTER_INFO.emailReply}</span>
              </p>
            </address>
            {!isContactPage && (
              <div className="rounded-xl overflow-hidden shadow-sm border border-border">
                <LazyIframe
                  title="Facebook Page - Gia Sư Hoàng Hà"
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61575087818708&tabs=timeline&width=430&height=380&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  height={380}
                  style={{ minHeight: 150 }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            )}
          </div>
        </div>

        <Separator className="mt-12 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Trung tâm Gia Sư Hoàng Hà. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
