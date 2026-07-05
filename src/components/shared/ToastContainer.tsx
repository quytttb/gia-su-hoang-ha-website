import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { Toast as ToastType } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2" aria-live="polite" aria-label="Thông báo">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
