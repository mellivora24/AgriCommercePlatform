export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.163:3000',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
} as const;
