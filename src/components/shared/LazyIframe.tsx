import { useEffect, useRef, useState } from 'react';

interface LazyIframeProps {
  title: string;
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  allow?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  placeholder?: React.ReactNode;
}

const LazyIframe = ({
  title,
  src,
  width = '100%',
  height = 380,
  className,
  style,
  allowFullScreen,
  loading = 'lazy',
  allow,
  referrerPolicy,
  placeholder,
}: LazyIframeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: typeof height === 'number' ? height : undefined }}
    >
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          width={width}
          height={height}
          style={{ border: 0, ...style }}
          allowFullScreen={allowFullScreen}
          loading={loading}
          allow={allow}
          referrerPolicy={referrerPolicy}
        />
      ) : (
        (placeholder ?? (
          <div
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm"
            style={{ width: '100%', height: typeof height === 'number' ? height : 200 }}
          >
            Đang tải...
          </div>
        ))
      )}
    </div>
  );
};

export default LazyIframe;
