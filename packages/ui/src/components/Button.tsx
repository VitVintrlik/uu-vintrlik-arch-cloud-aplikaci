import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-standard text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-fixed disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/90',
        secondary:
          'border border-outline-variant/20 bg-transparent hover:bg-surface-container-high text-on-surface',
        danger: 'bg-error text-on-error hover:bg-error/90',
        ghost: 'hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    icon?: ReactNode;
    ref?: Ref<HTMLButtonElement>;
  };

/** Interactive element with four variants (primary, secondary, danger, ghost), four sizes, optional icon, and a loading state with spinner. */
export const Button = ({
  className,
  variant,
  size,
  isLoading,
  icon,
  children,
  ref,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || disabled}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
