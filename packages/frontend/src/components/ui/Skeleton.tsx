import { type FC } from 'react';

type SkeletonProps = {
  className?: string;
};

/** Animated placeholder block for loading states. */
export const Skeleton: FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-surface-container rounded-md ${className}`}
    aria-hidden="true"
  />
);
