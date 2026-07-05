import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 dark:text-amber-400 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Không tìm thấy trang
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại đường
          dẫn hoặc quay lại trang chủ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="btn-primary">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-black dark:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
