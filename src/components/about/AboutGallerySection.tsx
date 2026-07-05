import { Dialog, DialogContent } from '../ui/dialog';
import SectionHeading from '../shared/SectionHeading';

const GALLERY_IMAGES = [
  '/images/real-photos/3d771690d24865163c59.jpg',
  '/images/real-photos/786448b78c6f3b31627e.jpg',
  '/images/real-photos/bf72059fc14776192f56.jpg',
  '/images/real-photos/37a0735db78500db5994.jpg',
  '/images/real-photos/e6bc4d52898a3ed4679b.jpg',
  '/images/real-photos/cf33f8c83c108b4ed201.jpg',
  '/images/real-photos/d7391421d0f967a73ee8.jpg',
  '/images/real-photos/0021e9c32d1b9a45c30a.jpg',
  '/images/real-photos/024a47b98361343f6d70.jpg',
  '/images/real-photos/fbf5ce260afebda0e4ef.jpg',
];

interface AboutGallerySectionProps {
  previewImg: string | null;
  onPreview: (url: string) => void;
  onClosePreview: () => void;
}

const AboutGallerySection = ({
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
        {GALLERY_IMAGES.map((url, idx) => (
          <div
            key={url}
            className="overflow-hidden rounded-lg shadow-md group relative cursor-pointer"
            onClick={() => onPreview(url)}
          >
            <img
              src={url}
              alt={`Hình thực tế ${idx + 1}`}
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
