import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner as BannerType } from '../../types';

interface BannerProps {
  banners: BannerType[];
  autoplay?: boolean;
  interval?: number;
}

const Banner = ({ banners, autoplay = true, interval = 8000 }: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter only active banners and sort by order
  const activeBanners = banners.filter(banner => banner.isActive).sort((a, b) => a.order - b.order);

  // Function to reset and start timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (autoplay && activeBanners.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % activeBanners.length);
      }, interval);
    }
  }, [autoplay, activeBanners.length, interval]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + activeBanners.length) % activeBanners.length);
    resetTimer(); // Reset timer when user manually navigates
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % activeBanners.length);
    resetTimer(); // Reset timer when user manually navigates
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
    resetTimer(); // Reset timer when user clicks indicator
  };

  // Swipe/drag logic
  let startX = 0;
  let isDragging = false;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      isDragging = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  // Mouse drag for desktop
  let mouseDown = false;
  let mouseStartX = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDown = true;
    mouseStartX = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return;
    const diff = e.clientX - mouseStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      mouseDown = false;
    }
  };

  const handleMouseUp = () => {
    mouseDown = false;
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden h-[400px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map(banner => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <div
              className="h-[400px] bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
              }}
            >
              {/* Chỉ hiển thị overlay khi có tiêu đề, phụ đề hoặc link */}
              {(banner.title || banner.subtitle || banner.link) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4 max-w-3xl">
                    <div className="inline-block bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4">
                      {banner.title && (
                        <h2
                          className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-2xl"
                          style={{ textShadow: '0 2px 16px #000, 0 1px 0 #222' }}
                        >
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p
                          className="text-xl md:text-2xl mb-6 text-white/95 drop-shadow-xl font-semibold"
                          style={{ textShadow: '0 2px 12px #000, 0 1px 0 #222' }}
                        >
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.link && (
                        <Button asChild size="lg" className="shadow-lg hover:shadow-xl">
                          <a href={banner.link}>Xem thêm</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handlePrev}
            aria-label="Banner trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handleNext}
            aria-label="Banner sau"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`w-3 h-3 rounded-full p-0 min-w-0 ${
                index === currentIndex ? 'bg-primary' : 'bg-background'
              }`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Chuyển đến banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
