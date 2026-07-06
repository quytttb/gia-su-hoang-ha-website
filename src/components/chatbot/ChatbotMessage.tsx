import { parseMarkdown } from '../../utils/parseMarkdown';
import { ChatMessage } from '../shared/Chatbot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatbotMessageProps {
  message: ChatMessage;
  onQuickReply: (reply: string) => void;
  onOpenFacebook: () => void;
}

const ChatbotMessage = ({ message, onQuickReply, onOpenFacebook }: ChatbotMessageProps) => {
  const isBot = message.isBot;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'max-w-[85%] p-3 rounded-lg text-sm leading-relaxed',
          isBot
            ? 'bg-muted text-foreground border border-border'
            : 'bg-primary text-primary-foreground rounded-bl-none ml-auto'
        )}
      >
        <div className="whitespace-pre-line">{parseMarkdown(message.content)}</div>
      </div>

      {isBot && message.quickReplies && (
        <div className="flex flex-wrap gap-2 max-w-[85%]">
          {message.quickReplies.map((reply, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onQuickReply(reply)}
              className="rounded-full text-xs h-auto py-1.5 px-3"
            >
              {reply}
            </Button>
          ))}
        </div>
      )}

      {isBot && message.type === 'facebook' && (
        <div className="max-w-[85%]">
          <Button type="button" size="sm" onClick={onOpenFacebook}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Truy cập Facebook Fanpage</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatbotMessage;
