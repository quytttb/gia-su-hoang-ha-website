import Link from 'next/link';
import Logo from '../shared/Logo';
import LazyIframe from '../shared/LazyIframe';
import { CENTER_INFO } from '../../constants/centerInfo';

interface FooterProps {
  isContactPage?: boolean;
}

const Footer = ({ isContactPage = false }: FooterProps) => {
  return (
    <footer className="bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-white py-10 border-t border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[400px_320px_1fr] gap-8">
          <div>
            <Logo variant="text" size="lg" linkTo="/" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Trung tâm gia sư uy tín tại Thanh Hóa
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Mang đến kiến thức và kỹ năng cho thế hệ trẻ
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/classes"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Khóa học
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor-search"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Tìm gia sư
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Lịch học
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Liên hệ</h4>
            <address className="not-italic text-gray-600 dark:text-gray-300 mb-4">
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

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Trung tâm Gia Sư Hoàng Hà. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
