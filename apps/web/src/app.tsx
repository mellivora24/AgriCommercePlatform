import React from 'react';
import { AppProvider } from './core/providers';
import { Router } from './core/router';

export const App: React.FC = () => (
  <AppProvider>
    <Router />
  </AppProvider>
);
