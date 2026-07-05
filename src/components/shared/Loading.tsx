import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
  description?: string;
}

const Loading = ({ message = 'Đang tải...', fullPage = true, description }: LoadingProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg px-8 py-12 border border-gray-200 dark:border-gray-700 animate-fade-in max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <Loader2 className="h-24 w-24 text-primary animate-spin" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
        {message}
      </h2>

      {description && <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
