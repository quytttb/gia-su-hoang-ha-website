import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClickToLoadMapProps {
  mapSrc: string;
  title?: string;
  height?: number;
}

const ClickToLoadMap = ({
  mapSrc,
  title = 'Google Maps - Gia Sư Hoàng Hà',
  height = 320,
}: ClickToLoadMapProps) => {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={mapSrc}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setLoaded(true)}
      className="w-full h-auto flex flex-col items-center justify-center gap-3 bg-muted hover:bg-muted/80 border-0 p-0 rounded-none"
      style={{ height }}
      aria-label="Nhấn để tải bản đồ Google Maps"
    >
      <MapPin className="w-10 h-10 text-primary" aria-hidden="true" />
      <span className="text-muted-foreground text-sm font-medium">Nhấn để xem bản đồ</span>
    </Button>
  );
};

export default ClickToLoadMap;
