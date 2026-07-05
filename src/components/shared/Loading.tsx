import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
  description?: string;
}

const Loading = ({ message = 'Đang tải...', fullPage = true, description }: LoadingProps) => {
  const content = (
    <Card className="max-w-md mx-auto shadow-lg animate-in fade-in duration-500">
      <CardContent className="flex flex-col items-center justify-center p-12">
        <div className="flex justify-center mb-8">
          <Loader2 className="h-24 w-24 text-primary animate-spin" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4 text-center">{message}</h2>

        {description && <p className="text-muted-foreground text-center">{description}</p>}
      </CardContent>
    </Card>
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

export default Loading;
