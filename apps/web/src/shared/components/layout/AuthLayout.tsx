import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
