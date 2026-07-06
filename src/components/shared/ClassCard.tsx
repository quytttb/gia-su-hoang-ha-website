import Link from 'next/link';
import { Class } from '../../types';
import { calculateDiscountedPrice, formatCurrency, hasValidDiscount } from '../../utils/helpers';
import LazyImage from './LazyImage';
import { trackClassView, trackUserEngagement } from '../../utils/analytics';
import { trackClassViewEcommerce, trackAddToCart } from '../../utils/ecommerce';
import { parseMarkdown } from '../../utils/parseMarkdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ClassCardProps {
  class: Class;
}

const ClassCard = ({ class: classData }: ClassCardProps) => {
  const { id, name, description, targetAudience, price, discount, discountEndDate, imageUrl } =
    classData;

  const hasValidDiscountValue = hasValidDiscount(discount, discountEndDate);
  const finalPrice = hasValidDiscountValue ? calculateDiscountedPrice(price, discount) : price;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg max-w-[400px] w-full mx-auto">
      <div className="aspect-[1180/800] w-full flex items-center justify-center bg-background">
        <LazyImage
          src={imageUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          className="bg-background"
        />
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{name}</h3>

        <div className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {parseMarkdown(description)}
        </div>

        <div className="mb-3 space-y-1">
          <span className="text-muted-foreground text-sm block">
            <strong>Lịch học:</strong> thứ 2 đến 4
          </span>
          <span className="text-muted-foreground text-sm block">
            <strong>Giờ học:</strong> 19:30 đến 21:30
          </span>
          <span className="text-muted-foreground text-sm block">
            <strong>Số lượng:</strong> 12
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            {hasValidDiscountValue ? (
              <div className="flex flex-col">
                <span className="text-muted-foreground line-through text-sm">
                  {formatCurrency(price)}
                </span>
                <span className="text-primary dark:text-blue-400 font-bold">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-primary dark:text-blue-400 font-bold">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          {hasValidDiscountValue ? (
            <div className="bg-primary text-white text-sm px-2 py-1 rounded-lg">
              Giảm {discount}%
            </div>
          ) : null}
        </div>

        <div className="flex space-x-2">
          <Button asChild className="flex-1">
            <Link
              href={`/classes/${id}`}
              onClick={() => {
                trackClassView(id.toString(), name);
                trackClassViewEcommerce({
                  id: id.toString(),
                  name,
                  price: finalPrice,
                  category: targetAudience,
                });
                trackUserEngagement('click', 'class_detail_button');
              }}
            >
              Xem chi tiết
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link
              href={`/classes/${id}/register`}
              onClick={() => {
                trackAddToCart({
                  id: id.toString(),
                  name,
                  price: finalPrice,
                  category: targetAudience,
                });
                trackUserEngagement('click', 'class_register_button');
              }}
            >
              Đăng ký
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
