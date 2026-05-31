import * as React from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

/** Multi-line text input matching Input's design language. Browser resize is disabled to preserve layout. */
export const Textarea = ({ className, hasError, ref, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        'w-full bg-surface-container-high border rounded-lg p-3 text-on-surface font-mono text-body-md transition-colors outline-none focus:ring-1 resize-none',
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
