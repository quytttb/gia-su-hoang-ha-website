import { Class } from '../../types';
import { formatCurrency, hasValidDiscount } from '../../utils/helpers';

interface ClassRegistrationSummaryProps {
  course: Class;
}

const ClassRegistrationSummary = ({ course }: ClassRegistrationSummaryProps) => {
  const hasValidDiscountValue = hasValidDiscount(course.discount, course.discountEndDate);

  return (
    <div className="bg-background p-6 rounded-lg shadow-md flex flex-col h-full">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Thông tin lớp học</h3>
      <div className="mb-4 flex items-center justify-center bg-background rounded-lg overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.name}
          className="w-full max-w-[1180px] h-auto aspect-[1180/800] object-contain bg-background"
        />
      </div>
      <h4 className="font-bold text-black dark:text-white mb-2">{course.name}</h4>
      <p className="text-muted-foreground text-sm mb-4">
        {course.description.substring(0, 100)}...
      </p>
      <div className="mt-2 mb-4">
        <h5 className="font-semibold text-black dark:text-white mb-2">Thông tin lớp học</h5>
        <div className="text-sm text-foreground space-y-1">
          <div className="border-b border-gray-100 dark:border-border pb-1">
            <span className="font-medium">Lịch học:</span> thứ 2 đến 4
          </div>
          <div className="border-b border-gray-100 dark:border-border pb-1">
            <span className="font-medium">Giờ học:</span> 19:30 đến 21:30
          </div>
          <div className="pb-1">
            <span className="font-medium">Số lượng:</span> 12
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-black dark:text-white">Học phí:</span>
          <span className="font-semibold text-black dark:text-white">
            {formatCurrency(course.price)}
          </span>
        </div>
        {hasValidDiscountValue && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-black dark:text-white">Giảm giá:</span>
            <span className="text-green-600">-{course.discount}%</span>
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground mt-4">
        <p>* Học phí sẽ được thanh toán tại trung tâm sau khi đăng ký được xác nhận.</p>
      </div>
    </div>
  );
};

export default ClassRegistrationSummary;
