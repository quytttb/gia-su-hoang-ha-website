import { Home, Users, School, MessageCircle, House } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';

const SERVICES_TOP = [
  {
    icon: Home,
    iconBg: 'bg-blue-50 dark:bg-blue-900',
    iconColor: 'text-blue-500 dark:text-blue-300',
    title: 'Gia sư tại nhà 1 kèm 1',
    description:
      'Đội ngũ Gia sư bao gồm Giáo viên và Sinh viên chuyên môn tốt, tận tâm. Dạy kèm ngay tại nhà với phương pháp kèm cặp sát sao, giáo án được cá nhân hoá học sinh giúp tối ưu thời gian di chuyển và học tập.',
  },
  {
    icon: Users,
    iconBg: 'bg-green-50 dark:bg-green-900',
    iconColor: 'text-green-500 dark:text-green-300',
    title: 'Gia sư nhóm nhỏ',
    description:
      'Gia sư dạy kèm tại nhà nhóm nhỏ từ 2 đến 3 bạn, với phương pháp kèm cặp sát sao, giáo án linh hoạt phù hợp từng bạn, giúp các bạn Học viên trải nghiệm học tập ngay tại nhà cũng như Phụ huynh giảm tải học phí mà vẫn hiệu quả.',
  },
  {
    icon: School,
    iconBg: 'bg-yellow-50 dark:bg-yellow-900',
    iconColor: 'text-yellow-500 dark:text-yellow-300',
    title: 'Chiêu sinh mở lớp',
    description:
      'Các lớp học tại Trung tâm bao gồm Tiền Tiểu học, Lớp Toán, Văn và Tiếng Anh sĩ số từ 10 đến 12 học viên được đứng lớp bới các Giáo viên nhiều năm kinh nghiệm giảng dạy giúp Học viên trải nghiệm không gian học tập thoáng mát rộng rãi, phù hợp với các Phụ huynh có điều kiện thu nhập vừa hoặc thấp.',
  },
];

const SERVICES_BOTTOM = [
  {
    icon: MessageCircle,
    iconBg: 'bg-purple-50 dark:bg-purple-900',
    iconColor: 'text-purple-500 dark:text-purple-300',
    title: 'Tư vấn, định hướng giáo dục',
    description:
      'Hỗ trợ tư vấn các Phụ huynh và Học viên bởi đội ngũ Giáo viên và Chuyên gia nhiều năm kinh nghiệm trong ngành giáo dục tại địa phương. Giúp các Phụ huynh hiểu hơn về lực học cũng như đưa ra các định hướng đúng đắn để giúp con em mình tiến bộ và đạt được mục tiêu học tập đã đề ra.',
  },
  {
    icon: House,
    iconBg: 'bg-pink-50 dark:bg-pink-900',
    iconColor: 'text-pink-500 dark:text-pink-300',
    title: 'Cho thuê Phòng học',
    description:
      'Tiếp nhận nhu cầu và kết hợp với các Giáo viên có mong muốn sử dụng Phòng học đủ tiêu chuẩn và sắp xếp lịch trình sử dụng phù hợp.',
  },
];

const ServiceCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: (typeof SERVICES_TOP)[0]) => (
  <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 flex flex-col items-center">
    <div className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-10 h-10 ${iconColor}`} />
    </div>
    <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{title}</div>
    <div className="text-gray-600 dark:text-gray-300 text-sm text-center">{description}</div>
  </div>
);

const AboutServicesSection = () => (
  <section className="section-padding bg-white dark:bg-gray-900" id="services">
    <div className="container-custom">
      <SectionHeading title="Chúng tôi cung cấp" id="services-heading" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-8">
        {SERVICES_TOP.map(service => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-center mx-auto w-full max-w-3xl">
        {SERVICES_BOTTOM.map(service => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  </section>
);

export default AboutServicesSection;
