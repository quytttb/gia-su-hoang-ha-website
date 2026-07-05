import SectionHeading from '../shared/SectionHeading';

const AboutHistorySection = () => (
  <section className="section-padding bg-gray-50 dark:bg-gray-900" id="history-founder">
    <div className="container-custom">
      <div className="w-full text-center">
        <SectionHeading title="Lịch sử phát triển" id="history-heading" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center mt-8">
        <div className="md:col-span-2">
          <p className="text-gray-700 text-lg leading-relaxed dark:text-gray-200 mb-6">
            Trung tâm Gia sư Hoàng Hà ra đời từ tâm huyết của Nhà sáng lập Nguyễn Nguyên Hoàng – tốt
            nghiệp chuyên ngành Quản trị Kinh doanh thuộc Trường Đại học Mở Hà Nội, một người trẻ
            lớn lên trong gia đình có truyền thống giáo dục lâu đời và nhiều thế hệ tại vùng đất
            Thạch Thành, Thanh Hoá. Không chỉ thấm nhuần những giá trị sâu sắc về giáo dục từ trong
            chính ngôi nhà của mình, anh còn dành nhiều năm gắn bó trực tiếp với nghề gia sư trong
            suốt thời sinh viên. Từ việc đồng hành cùng những học sinh mất gốc cần sự kiên trì, đến
            việc định hướng cho các em khá giỏi bứt phá, đã giúp anh hiểu rõ hơn những khó khăn,
            khát vọng và kỳ vọng của mỗi em học sinh cũng như những tâm tư của mỗi bậc phụ huynh
            trong hành trình học tập.
            <br />
            <br />
            Chính những trải nghiệm đó đã hình thành nên lý tưởng giáo dục của Hoàng Hà, xây dựng
            một môi trường học tập gần gũi, niềm tin và giàu cảm hứng, nơi học sinh được quan tâm
            như chính người thân trong gia đình, và được đặt vào sự tin tưởng để phát huy hết tiềm
            năng bản thân. Với tôn chỉ &quot;Dẫn lối tri thức – Vững bước tương lai&quot;, Trung tâm
            Gia sư Hoàng Hà tự hào đồng hành cùng quý Phụ huynh và Học sinh Thanh Hoá trên chặng
            đường chinh phục tri thức và hướng đến một tương lai rộng mở phía trước.
          </p>
        </div>
        <div className="flex flex-col items-center md:col-span-1">
          <img
            src="/assets/images/founder.png"
            alt="Nhà sáng lập"
            className="w-64 h-64 object-cover rounded-full shadow-lg mb-6"
          />
          <div className="text-center">
            <div className="font-bold text-2xl text-yellow-500 mb-2">NGUYỄN NGUYÊN HOÀNG</div>
            <div className="font-semibold text-lg text-blue-600 mb-1">Nhà Sáng lập</div>
            <div className="text-gray-700 dark:text-gray-300">Trung tâm Gia sư Hoàng Hà</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutHistorySection;
