import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
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
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Cảnh báo cấu hình Email</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Một số cấu hình email chưa được thiết lập:</p>
            <ul className="list-disc pl-5 mt-1">
              {status.missingFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
            <p className="mt-2">
              Form liên hệ có thể không hoạt động đúng cách. Vui lòng kiểm tra cấu hình EmailJS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailServiceStatus;
