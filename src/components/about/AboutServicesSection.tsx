import { Home, Users, School, MessageCircle, House } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';

const ICON_STYLES = [
  { iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { iconBg: 'bg-accent/20', iconColor: 'text-accent-foreground' },
  { iconBg: 'bg-secondary', iconColor: 'text-secondary-foreground' },
  { iconBg: 'bg-muted', iconColor: 'text-foreground' },
  { iconBg: 'bg-primary/10', iconColor: 'text-primary' },
] as const;

const SERVICES_TOP = [
  {
    icon: Home,
    title: 'Gia sư tại nhà 1 kèm 1',
    description:
      'Đội ngũ Gia sư bao gồm Giáo viên và Sinh viên chuyên môn tốt, tận tâm. Dạy kèm ngay tại nhà với phương pháp kèm cặp sát sao, giáo án được cá nhân hoá học sinh giúp tối ưu thời gian di chuyển và học tập.',
  },
  {
    icon: Users,
    title: 'Gia sư nhóm nhỏ',
    description:
      'Gia sư dạy kèm tại nhà nhóm nhỏ từ 2 đến 3 bạn, với phương pháp kèm cặp sát sao, giáo án linh hoạt phù hợp từng bạn, giúp các bạn Học viên trải nghiệm học tập ngay tại nhà cũng như Phụ huynh giảm tải học phí mà vẫn hiệu quả.',
  },
  {
    icon: School,
    title: 'Chiêu sinh mở lớp',
    description:
      'Các lớp học tại Trung tâm bao gồm Tiền Tiểu học, Lớp Toán, Văn và Tiếng Anh sĩ số từ 10 đến 12 học viên được đứng lớp bới các Giáo viên nhiều năm kinh nghiệm giảng dạy giúp Học viên trải nghiệm không gian học tập thoáng mát rộng rãi, phù hợp với các Phụ huynh có điều kiện thu nhập vừa hoặc thấp.',
  },
];

const SERVICES_BOTTOM = [
  {
    icon: MessageCircle,
    title: 'Tư vấn, định hướng giáo dục',
    description:
      'Hỗ trợ tư vấn các Phụ huynh và Học viên bởi đội ngũ Giáo viên và Chuyên gia nhiều năm kinh nghiệm trong ngành giáo dục tại địa phương. Giúp các Phụ huynh hiểu hơn về lực học cũng như đưa ra các định hướng đúng đắn để giúp con em mình tiến bộ và đạt được mục tiêu học tập đã đề ra.',
  },
  {
    icon: House,
    title: 'Cho thuê Phòng học',
    description:
      'Tiếp nhận nhu cầu và kết hợp với các Giáo viên có mong muốn sử dụng Phòng học đủ tiêu chuẩn và sắp xếp lịch trình sử dụng phù hợp.',
  },
];

type ServiceItem = (typeof SERVICES_TOP)[0];

const ServiceCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: ServiceItem & { iconBg: string; iconColor: string }) => (
  <Card>
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>
      <div className="font-semibold mb-1 text-foreground">{title}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
    </CardContent>
  </Card>
);

const SERVICES = [...SERVICES_TOP, ...SERVICES_BOTTOM];

const AboutServicesSection = () => (
  <section className="section-padding bg-background" id="services">
    <div className="container-custom">
      <SectionHeading title="Chúng tôi cung cấp" id="services-heading" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.title} {...service} {...ICON_STYLES[index]} />
        ))}
      </div>
    </div>
  </section>
);

export default AboutServicesSection;
