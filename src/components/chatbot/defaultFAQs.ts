import { CENTER_INFO } from '../../constants/centerInfo';

export type ChatbotFAQ = {
  keywords: string[];
  question: string;
  answer: string;
  type?: 'text' | 'contact' | 'facebook';
  quickReplies?: string[];
};

export const defaultFAQs: ChatbotFAQ[] = [
  {
    keywords: ['giờ', 'làm việc', 'mở cửa', 'đóng cửa', 'thời gian'],
    question: 'Trung tâm mở cửa những giờ nào?',
    answer: `🕐 **Giờ làm việc của trung tâm:**\n\n📅 **Thứ 2 - Thứ 6:** 7:30 - 20:00\n📅 **Thứ 7 - Chủ nhật:** 8:00 - 17:00\n\n💡 *Bạn có thể đến trực tiếp hoặc gọi điện trong giờ làm việc!*`,
    quickReplies: ['Xem lớp học', 'Liên hệ ngay', 'Địa chỉ trung tâm'],
  },
  {
    keywords: ['học phí', 'giá', 'tiền', 'thanh toán', 'phí', 'chi phí'],
    question: 'Học phí các lớp học là bao nhiêu?',
    answer: `💰 **Bảng học phí tham khảo:**\n\n📚 **Luyện thi THPT:** 2.500.000đ - 4.000.000đ\n📖 **Ôn thi Đại học:** 3.000.000đ - 4.500.000đ\n✏️ **Bổ trợ kiến thức:** 1.800.000đ - 2.800.000đ\n👥 **Gia sư 1-1:** 3.500.000đ - 5.000.000đ\n\n🎁 *Hiện có nhiều chương trình ưu đãi hấp dẫn!*`,
    quickReplies: ['Xem chi tiết lớp học', 'Đăng ký tư vấn', 'Chương trình ưu đãi'],
  },
  {
    keywords: ['đăng ký', 'tham gia', 'ghi danh', 'đăng kí'],
    question: 'Làm thế nào để đăng ký lớp học?',
    answer: `📝 **3 cách đăng ký dễ dàng:**\n\n🌐 **Online:** Đăng ký trực tuyến trên website\n📞 **Hotline:** ${CENTER_INFO.phone}\n🏢 **Trực tiếp:** Đến trung tâm tại Thanh Hóa\n\n✨ *Đăng ký ngay để nhận ưu đãi đặc biệt!*`,
    type: 'contact',
    quickReplies: ['Đăng ký online', 'Gọi hotline', 'Xem địa chỉ'],
  },
  {
    keywords: ['địa chỉ', 'nơi', 'vị trí', 'đâu', 'chỗ nào'],
    question: 'Trung tâm nằm ở đâu?',
    answer: `📍 **Địa chỉ trung tâm:**\n\n🏢 ${CENTER_INFO.addressShort}\nTỉnh Thanh Hóa\n\n🚗 *Gần trung tâm thành phố, dễ dàng di chuyển!*`,
    quickReplies: ['Xem bản đồ', 'Hướng dẫn đường đi', 'Liên hệ'],
  },
  {
    keywords: ['liên hệ', 'gọi', 'số', 'email', 'facebook', 'fb'],
    question: 'Làm thế nào để liên hệ với trung tâm?',
    answer: `📞 **Thông tin liên hệ:**\n\n☎️ **Hotline:** ${CENTER_INFO.phone}\n📧 **Email:** ${CENTER_INFO.email}\n📱 **Facebook:** ${CENTER_INFO.facebookName}\n🏢 **Địa chỉ:** ${CENTER_INFO.addressShort}\n\n💬 *Chúng tôi luôn sẵn sàng hỗ trợ bạn!*`,
    type: 'facebook',
    quickReplies: ['Gọi ngay', 'Gửi email', 'Nhắn Facebook', 'Đến trung tâm'],
  },
  {
    keywords: ['giáo viên', 'giảng viên', 'gia sư', 'thầy', 'cô'],
    question: 'Giáo viên tại trung tâm có kinh nghiệm không?',
    answer: `👨‍🏫 **Đội ngũ giáo viên chất lượng:**\n\n🎓 **Trình độ:** Thạc sĩ, Tiến sĩ các trường ĐH hàng đầu\n⭐ **Kinh nghiệm:** 5-15 năm giảng dạy\n🏆 **Thành tích:** Nhiều học sinh đỗ ĐH top đầu\n💡 **Phương pháp:** Hiện đại, phù hợp từng học sinh\n\n✨ *100% giáo viên được tuyển chọn kỹ lưỡng!*`,
    quickReplies: ['Xem giáo viên', 'Đăng ký học thử', 'Tư vấn lớp học'],
  },
  {
    keywords: ['lịch học', 'thời khóa biểu', 'ca học', 'buổi học'],
    question: 'Lịch học được sắp xếp như thế nào?',
    answer: `📅 **Lịch học linh hoạt:**\n\n🌅 **Sáng:** 7:30 - 11:30 (Chủ nhật)\n🌇 **Chiều:** 13:30 - 17:30 (Thứ 7 - CN)\n🌃 **Tối:** 18:00 - 21:00 (T2 - T6)\n\n⚡ **Đặc biệt:** Có thể sắp xếp lịch riêng theo yêu cầu\n\n📱 *Xem lịch chi tiết trên website!*`,
    quickReplies: ['Xem lịch học', 'Đăng ký lịch riêng', 'Tư vấn thời gian'],
  },
  {
    keywords: ['hỗ trợ', 'thêm', 'bổ trợ', 'dịch vụ'],
    question: 'Trung tâm có các dịch vụ hỗ trợ học tập nào?',
    answer: `🎯 **Dịch vụ hỗ trợ đa dạng:**\n\n👨‍🎓 **Gia sư 1-1:** Học riêng với giáo viên\n📚 **Lớp bổ trợ:** Củng cố kiến thức\n💻 **Tài liệu online:** Học mọi lúc mọi nơi\n📝 **Ôn tập định kỳ:** Kiểm tra tiến độ\n🎯 **Tư vấn học tập:** Lộ trình cá nhân hóa\n\n🌟 *Cam kết hỗ trợ tối đa cho học sinh!*`,
    quickReplies: ['Gia sư 1-1', 'Lớp bổ trợ', 'Tài liệu online'],
  },
  {
    keywords: ['hoàn tiền', 'đổi khóa', 'hủy', 'chính sách'],
    question: 'Chính sách hoàn tiền của trung tâm là gì?',
    answer: `💯 **Chính sách linh hoạt:**\n\n✅ **Hoàn tiền 100%** nếu không hài lòng sau 3 buổi đầu\n🔄 **Đổi lớp học** miễn phí (cùng giá trị)\n⏰ **Bảo lưu học phí** đến 6 tháng\n📞 **Hỗ trợ 24/7** giải quyết thắc mắc\n\n🤝 *Cam kết minh bạch, uy tín!*`,
    quickReplies: ['Tìm hiểu thêm', 'Liên hệ tư vấn', 'Đăng ký ngay'],
  },
  {
    keywords: ['facebook', 'fb', 'fanpage', 'mạng xã hội'],
    question: 'Facebook của trung tâm là gì?',
    answer: `📱 **Kết nối với chúng tôi trên Facebook:**\n\n👍 **Fanpage chính thức:** ${CENTER_INFO.facebookName}\n📢 **Cập nhật:** Tin tức, khuyến mãi mới nhất\n💬 **Tương tác:** Hỏi đáp trực tiếp\n📸 **Hình ảnh:** Hoạt động học tập tại trung tâm\n\n🔗 *Nhấn nút bên dưới để truy cập Facebook!*`,
    type: 'facebook',
    quickReplies: ['Truy cập Facebook', 'Nhắn tin Facebook', 'Theo dõi fanpage'],
  },
];
