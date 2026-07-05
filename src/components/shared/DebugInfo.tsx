import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';

const DebugInfo: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-4 left-4 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-lg border z-50 max-w-md">
      <h3 className="text-sm font-bold mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Database:</strong> {db ? '✅ Connected' : '❌ Not connected'}
        </div>
        <div>
          <strong>User:</strong> {user ? `✅ ${user.name} (${user.role})` : '❌ Not logged in'}
        </div>
        <div>
          <strong>UID:</strong> {user?.uid || 'N/A'}
        </div>
        <div>
          <strong>Admin:</strong> {user?.role === 'admin' ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Staff:</strong>{' '}
          {user?.role === 'staff' || user?.role === 'admin' ? '✅ Yes' : '❌ No'}
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;
