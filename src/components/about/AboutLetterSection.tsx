import { Card, CardContent } from '@/components/ui/card';

const AboutLetterSection = () => (
  <section className="section-padding bg-muted" id="letter">
    <div className="container-custom">
      <Card>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&w=800&q=80"
            alt="Thư ngỏ"
            className="min-w-[270px] max-w-[320px] w-full h-60 object-cover rounded-lg shadow mb-4 md:mb-0"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-primary">Thư ngỏ từ Trung tâm</h2>
            <p className="text-foreground text-lg mb-2">Kính gửi quý phụ huynh và học sinh,</p>
            <p className="text-muted-foreground text-base mb-2">
              Trung tâm Gia Sư Hoàng Hà xin gửi lời cảm ơn chân thành đến quý phụ huynh và học sinh
              đã tin tưởng, đồng hành cùng chúng tôi trong suốt thời gian qua. Chúng tôi cam kết
              không ngừng nâng cao chất lượng giảng dạy, lấy sự tiến bộ của học sinh làm mục tiêu
              hàng đầu. Rất mong tiếp tục nhận được sự ủng hộ và hợp tác của quý vị!
            </p>
            <div className="mt-4 text-muted-foreground">
              Trân trọng,
              <br />
              Ban Giám Đốc Trung tâm Gia Sư Hoàng Hà
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default AboutLetterSection;
