import { CenterInfo } from '../../types';

interface AboutIntroSectionProps {
  centerInfo: CenterInfo;
}

const AboutIntroSection = ({ centerInfo }: AboutIntroSectionProps) => (
  <section className="section-padding bg-background" id="about-intro">
    <div className="container-custom flex flex-col items-center justify-center text-center gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-400 uppercase">
          TRUNG TÂM GIA SƯ HOÀNG HÀ
        </h2>
        <div className="text-accent-500 font-semibold text-lg mb-2">
          Dẫn lối Tri thức - Vững bước Tương lai
        </div>
        <p className="text-lg text-foreground mb-2">
          Trung tâm Gia sư Hoàng Hà tự hào là một trong những Đơn vị Giáo dục uy tín hàng đầu tại
          Thành phố Thanh Hoá, nơi hội tụ đội ngũ giáo viên giỏi chuyên môn, tận tâm và am hiểu sâu
          sắc chương trình Giáo dục địa phương. Chúng tôi cam kết mang đến những tiết học chất
          lượng, hiệu quả và phù hợp với từng Học viên, hỗ trợ Quý Phụ huynh và đồng hành cùng các
          em trên hành trình chinh phục mục tiêu học tập.
        </p>
        <div className="text-muted-foreground text-base">
          <div>
            <b>Địa chỉ:</b> {centerInfo.address}
          </div>
          <div>
            <b>Điện thoại:</b> {centerInfo.phone}
          </div>
          <div>
            <b>Email:</b> giasuhoangha.tpth@gmail.com
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutIntroSection;
