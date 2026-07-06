import { useState, useEffect, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  trackChatbotOpen,
  trackChatbotClose,
  trackQuickReplyClick,
} from '../../utils/chatbotAnalytics';
import { defaultFAQs, ChatbotFAQ } from '../chatbot/defaultFAQs';
import ChatbotToggle from '../chatbot/ChatbotToggle';
import ChatbotMessage from '../chatbot/ChatbotMessage';
import { CENTER_INFO } from '../../constants/centerInfo';

export type ChatMessage = {
  id: string;
  content: string;
  isBot: boolean;
  type?: 'text' | 'quick-reply' | 'contact' | 'facebook';
  quickReplies?: string[];
};

interface ChatbotProps {
  faqs?: ChatbotFAQ[];
}

const Chatbot = ({ faqs = defaultFAQs }: ChatbotProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content:
        '👋 **Xin chào! Tôi là trợ lý ảo của Trung tâm Gia Sư Hoàng Hà.**\n\n💡 Tôi có thể giúp bạn:\n• Tìm hiểu về lớp học\n• Xem học phí và lịch học\n• Hướng dẫn đăng ký\n• Thông tin liên hệ\n\n❓ **Bạn muốn hỏi gì?**',
      isBot: true,
      type: 'quick-reply',
      quickReplies: ['Xem lớp học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleQuickReply = (reply: string) => {
    trackQuickReplyClick(reply);

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: reply,
      isBot: false,
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatLoading(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(reply);
      setChatMessages(prev => [...prev, botResponse]);
      setChatLoading(false);
    }, 500);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userInput,
      isBot: false,
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setChatLoading(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(userInput);
      setChatMessages(prev => [...prev, botResponse]);
      setChatLoading(false);
    }, 500);
  };

  const openFacebookPage = () => {
    window.open('https://www.facebook.com/profile.php?id=61575087818708', '_blank');
  };

  const generateBotResponse = (input: string): ChatMessage => {
    const lowercaseInput = input.toLowerCase();

    // Handle Facebook-related queries
    if (
      lowercaseInput.includes('facebook') ||
      lowercaseInput.includes('fb') ||
      lowercaseInput.includes('fanpage') ||
      lowercaseInput.includes('truy cập facebook') ||
      lowercaseInput.includes('nhắn tin facebook') ||
      lowercaseInput.includes('theo dõi fanpage')
    ) {
      return {
        id: Date.now().toString(),
        content: `📱 **Kết nối với Gia Sư Hoàng Hà trên Facebook!**\n\n👍 **Fanpage chính thức** với nhiều thông tin hữu ích:\n• 📢 Tin tức và khuyến mãi mới nhất\n• 📸 Hình ảnh hoạt động học tập\n• 💬 Tương tác trực tiếp với trung tâm\n• 🎓 Chia sẻ kinh nghiệm học tập\n\n🔗 **Nhấn nút bên dưới để truy cập!**`,
        isBot: true,
        type: 'facebook',
        quickReplies: ['Truy cập Facebook', 'Liên hệ khác', 'Quay lại menu chính'],
      };
    }

    // Handle contact-related queries
    if (lowercaseInput.includes('gọi ngay') || lowercaseInput.includes('hotline')) {
      return {
        id: Date.now().toString(),
        content: `📞 **Liên hệ ngay với chúng tôi:**\n\n☎️ **Hotline 1:** ${CENTER_INFO.phonePrimary}\n☎️ **Hotline 2:** ${CENTER_INFO.phoneSecondary}\n\n🕐 **Giờ hỗ trợ:**\n• T2-T6: 7:30 - 20:00\n• T7-CN: 8:00 - 17:00\n\n💡 *Gọi ngay để được tư vấn miễn phí!*`,
        isBot: true,
        type: 'contact',
        quickReplies: ['Gửi email', 'Xem địa chỉ', 'Facebook', 'Menu chính'],
      };
    }

    // Search through FAQs
    for (const faq of faqs) {
      for (const keyword of faq.keywords) {
        if (lowercaseInput.includes(keyword)) {
          return {
            id: Date.now().toString(),
            content: faq.answer,
            isBot: true,
            type: faq.type || 'quick-reply',
            quickReplies: faq.quickReplies || ['Tìm hiểu thêm', 'Liên hệ tư vấn', 'Menu chính'],
          };
        }
      }
    }

    // Handle greetings
    if (
      lowercaseInput.includes('xin chào') ||
      lowercaseInput.includes('hi') ||
      lowercaseInput.includes('hello') ||
      lowercaseInput.includes('chào')
    ) {
      return {
        id: Date.now().toString(),
        content: `👋 **Xin chào! Rất vui được hỗ trợ bạn!**\n\n🎯 **Tôi có thể giúp bạn:**\n• 📚 Thông tin các lớp học\n• 💰 Bảng giá học phí\n• 📅 Lịch học và đăng ký\n• 📞 Thông tin liên hệ\n• 📱 Kết nối Facebook\n\n❓ **Bạn muốn tìm hiểu về điều gì?**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
      };
    }

    // Handle thanks
    if (lowercaseInput.includes('cảm ơn') || lowercaseInput.includes('thank')) {
      return {
        id: Date.now().toString(),
        content: `🙏 **Không có gì! Rất vui được giúp đỡ bạn.**\n\n✨ **Nếu bạn cần hỗ trợ thêm:**\n• 📞 Gọi hotline: ${CENTER_INFO.phonePrimary}\n• 📱 Nhắn tin Facebook\n• 🏢 Đến trực tiếp trung tâm\n\n💪 **Chúc bạn học tập hiệu quả!**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Hỏi thêm', 'Liên hệ', 'Facebook', 'Kết thúc'],
      };
    }

    // Handle menu requests
    if (
      lowercaseInput.includes('menu') ||
      lowercaseInput.includes('quay lại') ||
      lowercaseInput.includes('menu chính')
    ) {
      return {
        id: Date.now().toString(),
        content: `📋 **Menu chính - Chọn thông tin bạn cần:**\n\n🎯 **Các chủ đề phổ biến:**`,
        isBot: true,
        type: 'quick-reply',
        quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook', 'Giáo viên'],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      content: `🤔 **Tôi chưa hiểu rõ câu hỏi của bạn.**\n\n💡 **Bạn có thể hỏi về:**\n• 📚 Khóa học và chương trình\n• 💰 Học phí và ưu đãi\n• 📝 Cách đăng ký\n• 📞 Thông tin liên hệ\n• 📱 Facebook fanpage\n\n❓ **Hoặc chọn chủ đề bên dưới:**`,
      isBot: true,
      type: 'quick-reply',
      quickReplies: ['Khóa học', 'Học phí', 'Đăng ký', 'Liên hệ', 'Facebook'],
    };
  };

  const toggleChat = () => {
    if (!isChatOpen) {
      trackChatbotOpen();
    } else {
      trackChatbotClose();
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isChatOpen ? 'w-80 md:w-96' : 'w-16 h-16'}`}>
      {isChatOpen ? (
        <div className="bg-background rounded-lg shadow-2xl flex flex-col h-[600px] overflow-hidden border border-border">
          {/* Enhanced Chat Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Trợ lý Hoàng Hà</h3>
                <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-primary-foreground hover:text-primary-foreground/80"
              aria-label="Đóng trợ lý ảo"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted">
            {chatMessages.map(message => (
              <ChatbotMessage
                key={message.id}
                message={message}
                onQuickReply={handleQuickReply}
                onOpenFacebook={openFacebookPage}
              />
            ))}
            {chatLoading && (
              <div className="flex space-x-1 p-3 max-w-[85%] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-100 dark:border-border">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Chat Input */}
          <div className="p-4 border-t border-border bg-background">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                value={userInput}
                onChange={handleChatInputChange}
                placeholder="Nhập câu hỏi của bạn..."
                className="rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!userInput.trim()}
                className="rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <ChatbotToggle onClick={toggleChat} />
      )}
    </div>
  );
};

export default Chatbot;
