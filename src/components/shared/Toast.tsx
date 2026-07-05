import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    const className = 'h-5 w-5';
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${className} text-green-500`} aria-hidden="true" />;
      case 'error':
        return <AlertCircle className={`${className} text-red-500`} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className={`${className} text-yellow-500`} aria-hidden="true" />;
      case 'info':
      default:
        return <Info className={`${className} text-blue-500`} aria-hidden="true" />;
    }
  };

  return (
    <div
      className={`max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3 transform transition-all duration-300 ease-in-out ${getToastStyles()}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{toast.title}</p>
          {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            onClick={() => onRemove(toast.id)}
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
