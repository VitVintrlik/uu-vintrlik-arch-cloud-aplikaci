import * as React from 'react';
import { cn } from '../utils/cn';

/** Surface container grouping related content. Composed with CardHeader, CardTitle, CardContent, and CardFooter sub-components. */
const Card = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn(
      'bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl shadow-sm',
      className,
    )}
    {...props}
  />
);

const CardHeader = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn('border-b border-outline-variant/20 pb-3 mb-4 flex flex-col gap-1', className)}
    {...props}
  />
);

const CardTitle = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> }) => (
  <h3
    ref={ref}
    className={cn('text-white font-sans font-black tracking-tight text-lg', className)}
    {...props}
  />
);

const CardContent = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div ref={ref} className={cn('', className)} {...props} />
);

const CardFooter = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className={cn('mt-4 pt-4 border-t border-outline-variant/20 flex items-center', className)}
    {...props}
  />
);

const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Footer: CardFooter,
});

export { CardComponent as Card, CardHeader, CardTitle, CardContent, CardFooter };
