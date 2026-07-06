import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Thời gian học tại trung tâm?',
    answer:
      'Trung tâm mở cửa từ 7:30 - 20:00 các ngày trong tuần và 8:00 - 17:00 vào cuối tuần. Thời gian cụ thể của mỗi lớp học sẽ được thông báo khi đăng ký.',
  },
  {
    question: 'Tôi có thể đăng ký học thử không?',
    answer:
      'Có, bạn có thể đăng ký học thử 1 buổi miễn phí tại trung tâm để trải nghiệm trước khi quyết định tham gia lớp học.',
  },
  {
    question: 'Chính sách hoàn tiền như thế nào?',
    answer:
      'Trung tâm có chính sách hoàn tiền nếu học viên không hài lòng sau 3 buổi học đầu tiên. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.',
  },
];

const ContactFAQSection = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold text-foreground mb-4">Câu hỏi thường gặp</h3>
    <Accordion type="single" collapsible className="w-full">
      {FAQ_ITEMS.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-medium text-foreground">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default ContactFAQSection;
