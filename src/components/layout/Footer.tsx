import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import LazyIframe from '@/components/shared/LazyIframe';
import { CENTER_INFO } from '@/constants/centerInfo';

interface FooterProps {
  isContactPage?: boolean;
}

const Footer = ({ isContactPage = false }: FooterProps) => {
  return (
    <footer className="bg-muted text-foreground py-10 border-t border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[400px_320px_1fr] gap-8">
          <div>
            <Logo variant="text" size="lg" linkTo="/" className="mb-4" />
            <p className="text-muted-foreground mb-2">Trung tâm gia sư uy tín tại Thanh Hóa</p>
            <p className="text-muted-foreground">Mang đến kiến thức và kỹ năng cho thế hệ trẻ</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-2">
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
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Liên hệ</h4>
            <address className="not-italic text-muted-foreground mb-4">
              <p className="mb-2">{CENTER_INFO.address}</p>
              <p className="mb-2">Điện thoại: {CENTER_INFO.phone}</p>
              <p className="mb-2">Email: {CENTER_INFO.emailReply}</p>
            </address>
            {!isContactPage && (
              <div className="mt-4 rounded overflow-hidden shadow">
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

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Trung tâm Gia Sư Hoàng Hà. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
