import { getTutorColorClasses, TutorTypeInfo } from './tutorRegistrationTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TutorInfoSidebarProps {
  tutorInfo: TutorTypeInfo;
}

const PROCESS_STEPS = [
  'Tiếp nhận yêu cầu',
  'Tư vấn chi tiết',
  'Tìm Gia sư phù hợp',
  'Dạy thử miễn phí',
  'Bắt đầu học chính thức',
];

const TutorInfoSidebar = ({ tutorInfo }: TutorInfoSidebarProps) => {
  const colors = getTutorColorClasses(tutorInfo.color);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Thông tin Gia sư</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-lg border ${colors.card}`}>
          <h4 className={`font-bold mb-2 ${colors.title}`}>{tutorInfo.name}</h4>
          <p className="text-foreground text-sm mb-3">{tutorInfo.description}</p>
          <div className={`text-2xl font-bold ${colors.price}`}>{tutorInfo.price}</div>
        </div>

        <div>
          <h5 className="font-semibold text-foreground mb-3">Quy trình</h5>
          <ol className="text-sm text-muted-foreground space-y-2">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0 h-5 w-5 p-0 justify-center text-xs">
                  {index + 1}
                </Badge>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-sm text-muted-foreground pt-4 border-t border-border space-y-1">
          <p>✓ Dạy thử miễn phí 1 buổi đầu tiên</p>
          <p>✓ Đổi Gia sư miễn phí nếu không phù hợp</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorInfoSidebar;
