import { type HTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-fixed/10 text-primary-fixed',
        secondary: 'bg-surface-container-highest text-on-surface-variant',
        danger: 'bg-error/10 text-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

/** Status or category label with three color variants: default (lime), secondary (surface), and danger (red). */
export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
};
