import SectionHeading from '../shared/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';

const AboutVisionSection = () => (
  <section className="section-padding bg-background" id="vision">
    <div className="container-custom">
      <SectionHeading title="Tầm nhìn" id="vision-heading" />
      <Card className="mt-8">
        <CardContent className="p-8">
          <p className="text-foreground text-center text-lg">
            Trở thành một điểm tựa tri thức uy tín cho mọi thế hệ Học sinh tại Thành phố Thanh Hoá.
            Bệ phóng giúp các em vượt lên chính mình, chinh phục mọi mục tiêu học tập và các mục
            tiêu đỗ đạt tại các ngôi trường danh tiếng tại địa phương như: THCS Trần Mai Ninh, THPT
            Chuyên Lam Sơn, THPT Hàm Rồng, THPT Đào Duy Từ,...
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default AboutVisionSection;
