import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '../../types';

interface LightboxProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onSelectPhoto
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, photo, photos]);

  if (!isOpen || !photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  };

  const currentFormatted = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const totalFormatted = photos.length < 10 ? `0${photos.length}` : `${photos.length}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F7F4]/98 backdrop-blur-md">
        {/* Top Header Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex items-center justify-between z-20 max-w-7xl mx-auto">
          {/* Index Counter */}
          <div className="text-xs font-mono text-[#77736D] tracking-widest">
            {currentFormatted} / {totalFormatted}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="text-[#171717] hover:text-[#77736D] p-2 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-[#171717] hover:text-[#77736D] transition-colors z-20 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-[#171717] hover:text-[#77736D] transition-colors z-20 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Central Clean Image & Title Display */}
        <div className="w-full max-w-5xl max-h-[85vh] px-6 sm:px-12 flex flex-col items-center justify-center">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative flex flex-col items-center max-h-[72vh]"
          >
            <img
              src={photo.image}
              alt={photo.title}
              className="max-h-[68vh] w-auto max-w-full object-contain shadow-sm"
            />
          </motion.div>

          {/* Minimal Title and Location */}
          <div className="mt-4 text-center">
            <h3 className="text-sm sm:text-base font-medium text-[#171717]">
              {photo.title}
            </h3>
            {(photo.location || photo.category) && (
              <p className="text-xs text-[#77736D] mt-1 font-light">
                {photo.location ? `${photo.location} • ` : ''}{photo.category}
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
