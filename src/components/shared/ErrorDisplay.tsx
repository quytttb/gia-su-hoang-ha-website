import React from 'react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
  details?: string;
  fullPage?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'error' | 'warning' | 'info';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'Đã có lỗi xảy ra',
  details = 'Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau. Nếu vấn đề vẫn tiếp diễn, hãy kiểm tra kết nối mạng hoặc liên hệ hỗ trợ.',
  fullPage = false,
  onRetry = () => window.location.reload(),
  retryLabel = 'Thử lại',
  type = 'error',
}) => {
  // Chọn icon và màu sắc dựa trên loại lỗi
  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return {
          icon: <AlertTriangle className="h-24 w-24 text-amber-500 dark:text-amber-400" />,
          textColor: 'text-amber-700 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          buttonColor: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700',
        };
      case 'info':
        return {
          icon: <Info className="h-24 w-24 text-blue-500 dark:text-blue-400" />,
          textColor: 'text-blue-700 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
        };
      case 'error':
      default:
        return {
          icon: <XCircle className="h-24 w-24 text-red-500 dark:text-red-400" />,
          textColor: 'text-red-700 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
        };
    }
  };

  const { icon, textColor, bgColor, borderColor, buttonColor } = getIconAndColor();

  const content = (
    <div
      className={`flex flex-col items-center justify-center ${bgColor} rounded-xl shadow-lg px-8 py-12 border ${borderColor} animate-fade-in max-w-md mx-auto`}
    >
      {/* Icon ở giữa */}
      <div className="flex justify-center mb-8">{icon}</div>

      {/* Tiêu đề lỗi */}
      <h2 className={`text-2xl font-bold ${textColor} mb-4 text-center`}>{message}</h2>

      {/* Chi tiết lỗi */}
      {details && <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">{details}</p>}

      {/* Nút thử lại */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={`${buttonColor} text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm`}
        >
          {retryLabel}
        </button>
      )}
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

export default ErrorDisplay;
