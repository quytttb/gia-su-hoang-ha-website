import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  variant?: 'default' | 'centered' | 'left';
  accent?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  variant = 'centered',
  accent = true,
  className,
  id,
  ...props
}) => {
  return (
    <div
      className={cn('mb-10', variant === 'centered' ? 'text-center' : 'text-left', className)}
      {...props}
    >
      <h2
        id={id}
        className={cn('text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight')}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'text-muted-foreground text-base md:text-lg',
            variant === 'centered' ? 'max-w-3xl mx-auto' : 'max-w-3xl'
          )}
        >
          {description}
        </p>
      )}

      {accent && (
        <div
          className={cn(
            'h-1.5 w-20 bg-primary mt-4 rounded-full',
            variant === 'centered' ? 'mx-auto' : ''
          )}
        />
      )}
    </div>
  );
};

export default SectionHeading;
