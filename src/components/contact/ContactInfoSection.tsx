import { MapPin, Phone, Mail } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import FacebookIcon from '../shared/icons/FacebookIcon';
import ClickToLoadMap from '../shared/ClickToLoadMap';
import { CENTER_INFO } from '../../constants/centerInfo';
import { Card, CardContent } from '@/components/ui/card';

const MAP_SRC =
  'https://www.google.com/maps?q=265%20%C4%90%C6%B0%E1%BB%9Dng%2006%2C%20M%E1%BA%B7t%20B%E1%BA%B1ng%2008%2C%20Ph%C6%B0%E1%BB%9Dng%20Nam%20Ng%E1%BA%A1n%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20Thanh%20Ho%C3%A1%2C%20T%E1%BB%89nh%20Thanh%20Ho%C3%A1&output=embed';

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    title: 'Địa chỉ',
    content: (
      <p>265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ</p>
    ),
  },
  {
    icon: Phone,
    title: 'Điện thoại',
    content: (
      <>
        <p>{CENTER_INFO.phone}</p>
        <p className="text-sm">Thứ 2 - Thứ 6: 7:30 - 20:00</p>
        <p className="text-sm">Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
      </>
    ),
  },
  {
    icon: Mail,
    title: 'Email',
    content: <p>{CENTER_INFO.emailReply}</p>,
  },
  {
    icon: FacebookIcon,
    title: 'Facebook',
    content: <p>Gia Sư Hoàng Hà - TP Thanh Hoá</p>,
  },
] as const;

const ContactInfoSection = () => (
  <div>
    <SectionHeading title="Thông Tin Liên Hệ" centered={false} id="contact-info-heading" />

    <div className="space-y-4">
      {CONTACT_ITEMS.map(({ icon: Icon, title, content }) => (
        <Card key={title}>
          <CardContent className="p-4 flex items-start gap-4">
            <div className="bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
              <div className="text-muted-foreground">{content}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="mt-8 overflow-hidden">
      <ClickToLoadMap mapSrc={MAP_SRC} height={320} />
    </Card>
  </div>
);

export default ContactInfoSection;
