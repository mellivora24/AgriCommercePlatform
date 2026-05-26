import React from 'react';
import classNames from 'classnames';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
}) => {
  const variantStyles = {
    primary: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={classNames(
        'px-3 py-1 rounded-full text-xs font-medium',
        variantStyles[variant],
      )}
    >
      {children}
    </span>
  );
};
