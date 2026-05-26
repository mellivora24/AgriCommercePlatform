export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN').format(d);
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
