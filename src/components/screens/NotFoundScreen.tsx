import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="max-w-md w-full p-8 text-center shadow-md">
        <CardContent className="p-0">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-4">Không tìm thấy trang</h2>
          <p className="text-muted-foreground mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại đường
            dẫn hoặc quay lại trang chủ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Về trang chủ
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundScreen;
