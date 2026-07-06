import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatbotToggleProps {
  onClick: () => void;
}

const ChatbotToggle = ({ onClick }: ChatbotToggleProps) => (
  <Button
    onClick={onClick}
    size="icon"
    className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 relative"
    aria-label="Mở trợ lý ảo"
  >
    <MessageCircle className="w-8 h-8" aria-hidden="true" />
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
      aria-hidden="true"
    >
      !
    </Badge>
  </Button>
);

export default ChatbotToggle;
