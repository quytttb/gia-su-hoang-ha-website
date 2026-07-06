import { MapPin, Phone, Mail } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import FacebookIcon from '../shared/icons/FacebookIcon';
import ClickToLoadMap from '../shared/ClickToLoadMap';
import { CENTER_INFO } from '../../constants/centerInfo';

const MAP_SRC =
  'https://www.google.com/maps?q=265%20%C4%90%C6%B0%E1%BB%9Dng%2006%2C%20M%E1%BA%B7t%20B%E1%BA%B1ng%2008%2C%20Ph%C6%B0%E1%BB%9Dng%20Nam%20Ng%E1%BA%A1n%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20Thanh%20Ho%C3%A1%2C%20T%E1%BB%89nh%20Thanh%20Ho%C3%A1&output=embed';

const ContactInfoSection = () => (
  <div>
    <SectionHeading title="Thông Tin Liên Hệ" centered={false} id="contact-info-heading" />

    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Địa chỉ</h3>
          <p className="text-muted-foreground">
            265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center">
          <Phone className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Điện thoại</h3>
          <p className="text-muted-foreground">{CENTER_INFO.phone}</p>
          <p className="text-muted-foreground text-sm">Thứ 2 - Thứ 6: 7:30 - 20:00</p>
          <p className="text-muted-foreground text-sm">Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center">
          <Mail className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Email</h3>
          <p className="text-muted-foreground">{CENTER_INFO.emailReply}</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center">
          <FacebookIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Facebook</h3>
          <p className="text-muted-foreground">Gia Sư Hoàng Hà - TP Thanh Hoá</p>
        </div>
      </div>
    </div>

    <div className="mt-8 rounded-lg overflow-hidden shadow-md">
      <ClickToLoadMap mapSrc={MAP_SRC} height={320} />
    </div>
  </div>
);

export default ContactInfoSection;
