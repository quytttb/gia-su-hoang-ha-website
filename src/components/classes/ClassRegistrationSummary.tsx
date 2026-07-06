import { Class } from '../../types';
import { formatCurrency, hasValidDiscount } from '../../utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ClassRegistrationSummaryProps {
  course: Class;
}

const ClassRegistrationSummary = ({ course }: ClassRegistrationSummaryProps) => {
  const hasValidDiscountValue = hasValidDiscount(course.discount, course.discountEndDate);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Thông tin lớp học</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="mb-4 flex items-center justify-center rounded-lg overflow-hidden">
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full max-w-[1180px] h-auto aspect-[1180/800] object-contain bg-muted"
          />
        </div>
        <h4 className="font-bold text-foreground mb-2">{course.name}</h4>
        <p className="text-muted-foreground text-sm mb-4">
          {course.description.substring(0, 100)}...
        </p>
        <div className="mt-2 mb-4">
          <h5 className="font-semibold text-foreground mb-2">Thông tin lớp học</h5>
          <div className="text-sm text-foreground space-y-1">
            <div className="border-b border-border pb-1">
              <span className="font-medium">Lịch học:</span> thứ 2 đến 4
            </div>
            <div className="border-b border-border pb-1">
              <span className="font-medium">Giờ học:</span> 19:30 đến 21:30
            </div>
            <div className="pb-1">
              <span className="font-medium">Số lượng:</span> 12
            </div>
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-foreground">Học phí:</span>
            <span className="font-semibold text-foreground">{formatCurrency(course.price)}</span>
          </div>
          {hasValidDiscountValue && (
            <div className="flex justify-between items-center">
              <span className="text-foreground">Giảm giá:</span>
              <Badge variant="success">-{course.discount}%</Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-auto">
          * Học phí sẽ được thanh toán tại trung tâm sau khi đăng ký được xác nhận.
        </p>
      </CardContent>
    </Card>
  );
};

export default ClassRegistrationSummary;
