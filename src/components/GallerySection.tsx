import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { GalleryCategory, GalleryPhoto } from '../types';
import { ResilientImage } from './ResilientImage';

interface GallerySectionProps {
  photos: GalleryPhoto[];
}

const GALLERY_FILTERS: ('All' | GalleryCategory)[] = [
  'All',
  'Nature',
  'Heritage',
  'Food',
  'Culture',
];

export function GallerySection({ photos }: GallerySectionProps) {
  const [filter, setFilter] = useState<'All' | GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visiblePhotos =
    filter === 'All' ? photos : photos.filter((photo) => photo.category === filter);

  const activePhoto =
    lightboxIndex !== null && visiblePhotos[lightboxIndex]
      ? visiblePhotos[lightboxIndex]
      : null;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, visiblePhotos.length]);

  return (
    <section
      id="gallery"
      className="scroll-mt-20 py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200/80"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#1B4332] font-semibold mb-2">
            03 · Visual Field Notes
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B4332] tracking-tight text-balance">
            Belagavi Tourist Photo Gallery
          </h2>
          <p className="mt-3 text-[#1F2937]/75 text-base leading-relaxed">
            A visual chronicle of monsoon cascades, carved Ratta stonework, festive drum processions, and culinary classics. Select any frame to inspect full-screen.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter photo gallery by theme"
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl self-start lg:self-auto"
        >
          {GALLERY_FILTERS.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(cat);
                  setLightboxIndex(null);
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1B4332] text-[#FAF9F6] shadow-sm'
                    : 'text-[#1F2937]/75 hover:text-[#1B4332] hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Masonry Gallery */}
      <div
        data-testid="photo-gallery-grid"
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {visiblePhotos.map((photo, index) => (
          <figure
            key={photo.id}
            className="break-inside-avoid bg-white rounded-[14px] overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow group"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open full view of ${photo.title}`}
              className="relative block w-full text-left overflow-hidden cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              <div className="overflow-hidden bg-stone-100">
                <ResilientImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  fallbackTitle={photo.title}
                  className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/55 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Expand className="w-4 h-4" />
              </span>
            </button>
            <figcaption className="p-4">
              <p className="text-xs font-medium text-[#1B4332]/80 mb-1">
                {photo.category}
                {photo.isCustom ? ' · Custom Survey Upload' : ''}
              </p>
              <h3 className="font-serif text-base font-semibold text-[#1F2937]">
                {photo.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {photo.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo lightbox: ${activePhoto.title}`}
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#FAF9F6] rounded-[14px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200">
              <div>
                <p className="text-xs text-[#1B4332] font-semibold">
                  {activePhoto.category} · Frame {lightboxIndex + 1} of{' '}
                  {visiblePhotos.length}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1F2937]">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-lg text-stone-600 hover:bg-stone-200/70 hover:text-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-stone-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <ResilientImage
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fallbackTitle={activePhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              {visiblePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + visiblePhotos.length) %
                          visiblePhotos.length
                      )
                    }
                    className="absolute left-3 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % visiblePhotos.length)
                    }
                    className="absolute right-3 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-white text-sm text-[#1F2937]/85">
              {activePhoto.caption}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
