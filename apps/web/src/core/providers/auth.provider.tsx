import React, { type PropsWithChildren } from 'react';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};