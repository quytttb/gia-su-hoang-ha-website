import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getEmailServiceStatus } from '../../services/emailService';

const EmailServiceStatus: React.FC = () => {
  const [status, setStatus] = useState<ReturnType<typeof getEmailServiceStatus> | null>(null);

  useEffect(() => {
    setStatus(getEmailServiceStatus());
  }, []);

  if (!status || status.isConfigured) {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 [&>svg]:text-amber-500">
      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      <AlertTitle>Cảnh báo cấu hình Email</AlertTitle>
      <AlertDescription>
        <p>Một số cấu hình email chưa được thiết lập:</p>
        <ul className="list-disc pl-5 mt-1">
          {status.missingFields.map(field => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <p className="mt-2">
          Form liên hệ có thể không hoạt động đúng cách. Vui lòng kiểm tra cấu hình EmailJS.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default EmailServiceStatus;
