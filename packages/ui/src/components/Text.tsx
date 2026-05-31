import { type HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: 'base' | 'muted' | 'error' | 'success';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  italic?: boolean;
  uppercase?: boolean;
};

/** Paragraph element with color variants (base, muted, error, success), size scale, weight, and modifier flags for italic and uppercase. */
export const Text = ({
  variant = 'base',
  size = 'base',
  weight = 'normal',
  italic = false,
  uppercase = false,
  className,
  children,
  ...props
}: TextProps) => {
  const variants = {
    base: 'text-on-surface',
    muted: 'text-on-surface-variant',
    error: 'text-error',
    success: 'text-primary-fixed',
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };

  return (
    <p
      className={cn(
        variants[variant],
        sizes[size],
        weights[weight],
        italic && 'italic',
        uppercase && 'uppercase tracking-widest',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};
