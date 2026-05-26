import React from 'react';
import classNames from 'classnames';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  className,
  circle,
}) => {
  return (
    <div
      className={classNames(
        'bg-gray-200 animate-pulse',
        circle ? 'rounded-full' : 'rounded',
        className,
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};
