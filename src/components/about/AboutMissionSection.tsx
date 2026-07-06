import SectionHeading from '../shared/SectionHeading';

const MISSION_ITEMS = [
  {
    bg: 'bg-blue-50 dark:bg-blue-900',
    title: 'Bệ phóng đáng tin cậy trên hành trình chinh phục kỳ thi vào lớp 10',
    description:
      'Trung tâm Gia sư Hoàng Hà cam kết trở thành điểm tựa vững chắc cho mọi thế hệ học sinh Thành phố Thanh Hoá trong hành trình chinh phục các kỳ thi chuyển cấp – đặc biệt là kỳ thi vào lớp 10. Với lộ trình học tập bài bản, sát năng lực và chiến lược ôn luyện rõ ràng, chúng tôi đồng hành cùng học sinh từ những nền móng đầu tiên đến khi tự tin bứt phá.',
  },
  {
    bg: 'bg-green-50 dark:bg-green-900',
    title: 'Xây dựng môi trường học tập tốt, thân thiện',
    description:
      'Chúng tôi chú trọng tạo dựng một không gian học tập tích cực, nơi mỗi học sinh đều được tôn trọng và tin tưởng vượt lên chính mình. Không chỉ là nơi dạy – học, Hoàng Hà còn là một góc học tập cởi mở, thân thiện, sẵn sàng lắng nghe và cùng nhau trưởng thành.',
  },
  {
    bg: 'bg-yellow-50 dark:bg-yellow-900',
    title: 'Lấy Học viên làm trung tâm - Tâm huyết làm nền tảng',
    description:
      'Mọi hoạt động của Trung tâm đều xoay quanh nhu cầu và sự tiến bộ của học viên. Với tinh thần phụng sự và tâm huyết không ngừng nghỉ, chúng tôi luôn nỗ lực nâng cao chất lượng giảng dạy và phát triển nhân lực trí tuệ, đóng góp vào sự phát triển chung Giáo dục Tỉnh nhà.',
  },
  {
    bg: 'bg-purple-50 dark:bg-purple-900',
    title: 'Không chỉ truyền dạy kiến thức – mà còn rèn luyện nhân cách',
    description:
      'Tại Hoàng Hà, việc dạy chữ luôn song hành cùng rèn luyện con người. Chúng tôi đề cao việc hình thành nhân cách, thái độ học tập và trách nhiệm cá nhân cho học viên, để mỗi em không chỉ giỏi về kiến thức, mà còn sống tử tế, yêu thương Gia đình, sống có mục tiêu và biết vươn lên trong cuộc sống.',
  },
];

const AboutMissionSection = () => (
  <section className="section-padding bg-muted" id="mission">
    <div className="container-custom">
      <SectionHeading title="Sứ mệnh" id="mission-heading" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {MISSION_ITEMS.map(item => (
          <div key={item.title} className="bg-white p-8 rounded-lg shadow-md dark:bg-card">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bg} flex-shrink-0`}
              >
                <img
                  src="/images/logo.png"
                  alt="Logo Trung tâm"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutMissionSection;
