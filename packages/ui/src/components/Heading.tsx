import { type HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3;
};

/** Typographic heading rendering h1–h3 with predefined size and weight scales based on the level prop. */
export const Heading = ({ level = 1, className, children, ...props }: HeadingProps) => {
  const Tag = `h${level}` as const;

  const levels = {
    1: 'text-3xl font-bold tracking-tight text-on-surface',
    2: 'text-2xl font-semibold tracking-tight text-on-surface',
    3: 'text-xl font-medium tracking-tight text-on-surface',
  };

  return (
    <Tag className={cn('font-sans', levels[level], className)} {...props}>
      {children}
    </Tag>
  );
};
