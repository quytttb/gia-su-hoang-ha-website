import React from 'react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  message?: string;
  details?: string;
  fullPage?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'error' | 'warning' | 'info';
}

const typeConfig = {
  error: {
    icon: XCircle,
    variant: 'destructive' as const,
    alertClass: '',
    iconClass: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    variant: 'default' as const,
    alertClass:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 [&>svg]:text-amber-500',
    iconClass: 'text-amber-500',
  },
  info: {
    icon: Info,
    variant: 'default' as const,
    alertClass:
      'border-primary/30 bg-primary/10 text-foreground dark:border-primary/40 dark:bg-primary/20 [&>svg]:text-primary',
    iconClass: 'text-primary',
  },
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'Đã có lỗi xảy ra',
  details = 'Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau. Nếu vấn đề vẫn tiếp diễn, hãy kiểm tra kết nối mạng hoặc liên hệ hỗ trợ.',
  fullPage = false,
  onRetry = () => window.location.reload(),
  retryLabel = 'Thử lại',
  type = 'error',
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const content = (
    <Alert
      variant={config.variant}
      className={cn(
        'flex flex-col items-center text-center px-8 py-12 max-w-md mx-auto shadow-lg animate-in fade-in duration-500 [&>svg]:static [&>svg]:mb-4 [&>svg~*]:pl-0 [&>svg+div]:translate-y-0',
        config.alertClass
      )}
    >
      <Icon className={cn('h-16 w-16', config.iconClass)} />
      <AlertTitle className="text-2xl font-bold mb-2">{message}</AlertTitle>
      {details && (
        <AlertDescription className="text-muted-foreground mb-6">{details}</AlertDescription>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant={type === 'error' ? 'destructive' : 'default'}>
          {retryLabel}
        </Button>
      )}
    </Alert>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 transition-colors duration-200">
        {content}
      </div>
    );
  }

  return content;
};

export default ErrorDisplay;
