export const ENV = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
} as const;
