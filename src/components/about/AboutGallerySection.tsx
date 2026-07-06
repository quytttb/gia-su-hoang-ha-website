import { Dialog, DialogContent } from '../ui/dialog';
import SectionHeading from '../shared/SectionHeading';
import type { GalleryImage } from '@/data/settings';

interface AboutGallerySectionProps {
  images: GalleryImage[];
  previewImg: string | null;
  onPreview: (url: string) => void;
  onClosePreview: () => void;
}

const AboutGallerySection = ({
  images,
  previewImg,
  onPreview,
  onClosePreview,
}: AboutGallerySectionProps) => (
  <section
    className="section-padding bg-white dark:bg-gray-900"
    aria-labelledby="gallery-heading"
    id="gallery"
  >
    <div className="container-custom">
      <SectionHeading title="Hình ảnh thực tế" id="gallery-heading" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-lg shadow-md group relative cursor-pointer"
            onClick={() => onPreview(image.url)}
          >
            <img
              src={image.url}
              alt={image.alt || `Hình thực tế ${idx + 1}`}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!previewImg} onOpenChange={open => !open && onClosePreview()}>
        <DialogContent className="max-w-3xl flex flex-col items-center">
          {previewImg && (
            <img
              src={previewImg}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg transition-opacity duration-300"
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  </section>
);

export default AboutGallerySection;
