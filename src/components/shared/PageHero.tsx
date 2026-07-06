import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  description?: string;
  id?: string;
  variant?: 'default' | 'image' | 'gradient';
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

const PageHero = ({
  title,
  description,
  id,
  variant = 'default',
  imageSrc = '/images/logo.png',
  imageAlt = 'Logo',
  imageClassName,
  children,
}: PageHeroProps) => {
  return (
    <section
      className={cn(
        'relative flex items-center justify-center min-h-[220px] md:min-h-[260px] py-8 md:py-10 overflow-hidden shadow-md border-b border-border',
        variant === 'gradient'
          ? 'bg-gradient-to-b from-hero-from to-hero-to'
          : 'bg-primary/10 dark:bg-gradient-to-b dark:from-hero-from dark:to-hero-to'
      )}
      aria-labelledby={id}
    >
      {variant === 'image' && imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none select-none z-0',
            imageClassName
          )}
        />
      )}

      {variant === 'default' && imageSrc && (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              'absolute inset-0 m-auto opacity-20 dark:opacity-25 pointer-events-none select-none z-0 brightness-[1.15]',
              imageClassName || 'w-[260px] h-[260px] md:w-[320px] md:h-[320px]'
            )}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-white/10 z-10" />
        </>
      )}

      <div className="container-custom relative z-20 flex flex-col items-center justify-center text-center">
        <h1
          id={id}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground drop-shadow-sm"
        >
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-0">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
