'use client';

import { useAuth } from '@/context/AuthContext';

export const AuthDebug = () => {
  const { user } = useAuth();
  const authData = localStorage.getItem('authData');

  return (
    <div className="d-none">
      <pre>
        User: {JSON.stringify(user, null, 2)}
        AuthData: {authData}
      </pre>
    </div>
  );
}; 