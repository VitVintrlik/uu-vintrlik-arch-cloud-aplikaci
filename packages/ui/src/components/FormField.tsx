import * as React from 'react';
import { cn } from '../utils/cn';

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

/** Layout wrapper adding a label, error message, and optional hint around a form control. */
export const FormField = ({ label, htmlFor, error, children, className }: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-label-sm font-mono text-on-surface-variant uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-xs font-sans text-error mt-1">{error}</span>}
    </div>
  );
};
