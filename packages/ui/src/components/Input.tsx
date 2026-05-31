import * as React from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

/** Single-line text input with error state styling and a primary-color focus ring. */
export const Input = ({ className, hasError, ref, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        'w-full bg-surface-container-high border rounded-lg p-3 text-on-surface font-mono text-body-md transition-colors outline-none focus:ring-1',
        hasError
          ? 'border-error/50 focus:border-error focus:ring-error/50'
          : 'border-outline-variant/20 focus:border-primary-fixed focus:ring-primary-fixed/20 hover:border-outline-variant/40',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
