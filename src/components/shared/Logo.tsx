import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  linkTo = '/',
}) => {
  const sizeClasses = {
    sm: 'h-8 md:h-10',
    md: 'h-12 md:h-14',
    lg: 'h-14 md:h-16 lg:h-20',
  };

  const logoContent = () => {
    if (variant === 'icon') {
      return (
        <img
          src="/images/logo.png"
          alt="Gia Sư Hoàng Hà"
          className={`${sizeClasses[size]} w-auto object-contain`}
        />
      );
    } else if (variant === 'text') {
      return (
        <div className="flex items-center">
          <img
            src="/images/logo-text.png"
            alt="Gia Sư Hoàng Hà"
            className={`${sizeClasses[size]} w-auto object-contain`}
            onError={e => {
              // Fallback if logo-text not found - show text version
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                                             <div class="flex flex-col">
                                                  <span class="font-bold text-primary text-lg leading-tight">
                                                    Gia Sư Hoàng Hà
                                                  </span>
                                                  <span class="text-muted-foreground text-xs leading-tight">
                                                    Tri thức là sức mạnh
                                                  </span>
                                             </div>
                                        `;
              }
            }}
          />
        </div>
      );
    } else {
      // Full logo using logo-text.png
      return (
        <img
          src="/images/logo-text.png"
          alt="Gia Sư Hoàng Hà"
          className={`${sizeClasses[size]} w-auto object-contain`}
          onError={e => {
            // Fallback if logo-text not found - show icon + text version
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'flex items-center space-x-2';
              fallbackDiv.innerHTML = `
                                        <img
                                             src="/images/logo.png"
                                             alt="Gia Sư Hoàng Hà"
                                             class="${sizeClasses[size]} w-auto object-contain"
                                        />
                                        <div class="flex flex-col">
                                             <span class="font-bold text-primary text-lg leading-tight">
                                               Gia Sư Hoàng Hà
                                             </span>
                                             <span class="text-muted-foreground text-xs leading-tight">
                                               Tri thức là sức mạnh
                                             </span>
                                        </div>
                                   `;
              parent.appendChild(fallbackDiv);
            }
          }}
        />
      );
    }
  };

  const content = logoContent();

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        className={`flex items-center transition-opacity hover:opacity-80 ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center ${className}`}>{content}</div>;
};

export default Logo;
