import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PhotoItem, HomepageSettings, CategoryType } from '../../types';
import { Lightbox } from './Lightbox';

interface PhotographyGalleryProps {
  photos: PhotoItem[];
  homepage: HomepageSettings;
}

export const PhotographyGallery: React.FC<PhotographyGalleryProps> = ({ photos, homepage }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const categories: CategoryType[] = ['All', 'Portrait', 'Lifestyle', 'Travel', 'Other'];

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => {
        const cat = p.category.toLowerCase();
        const active = activeCategory.toLowerCase();
        if (active === 'other') {
          return cat !== 'portrait' && cat !== 'lifestyle' && cat !== 'travel';
        }
        return cat === active;
      });

  const handleOpenLightbox = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setIsLightboxOpen(true);
  };

  return (
    <section
      id="photography"
      className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]"
    >
      {/* Section Header with Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-3"
          >
            Visual Archive
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal text-[#171717] tracking-tight"
          >
            {homepage.photographyHeading || "Photography"}
          </motion.h2>
        </div>

        {/* Minimal Category Text Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#171717] font-medium'
                    : 'text-[#77736D] hover:text-[#171717]'
                }`}
              >
                {cat}
                {isActive && (
                  <span className="block h-[1px] bg-[#171717] mt-0.5" />
                )}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Asymmetric Editorial Grid (Large, Small, Medium with Visual Rhythm) */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
      >
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => {
            // Asymmetric layout span mapping to create elegant visual rhythm
            const mod = index % 5;
            let colSpan = 'lg:col-span-6 aspect-[4/3] sm:aspect-[16/11]'; // Standard medium
            if (mod === 0) colSpan = 'lg:col-span-8 aspect-[4/3] sm:aspect-[16/10]'; // Large hero image
            if (mod === 1) colSpan = 'lg:col-span-4 aspect-[3/4] sm:aspect-[4/5]'; // Tall portrait
            if (mod === 2) colSpan = 'lg:col-span-4 aspect-[1/1] sm:aspect-[4/5]'; // Small/Medium
            if (mod === 3) colSpan = 'lg:col-span-4 aspect-[4/3] sm:aspect-[3/4]'; // Small
            if (mod === 4) colSpan = 'lg:col-span-4 aspect-[1/1] sm:aspect-[4/5]'; // Medium

            return (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                onClick={() => handleOpenLightbox(photo)}
                className={`group cursor-pointer ${colSpan} flex flex-col`}
              >
                {/* Image Container with Subtle 1.02x Zoom */}
                <div className="relative w-full h-full overflow-hidden bg-[#EAE7E0]">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] filter contrast-[1.01]"
                  />

                  {/* Subtle top/bottom title and arrow on hover */}
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent">
                    <div className="flex justify-end">
                      <span className="bg-[#F8F7F4]/95 text-[#171717] p-2 rounded-none text-xs">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle Clean Metadata under image */}
                <div className="flex items-center justify-between pt-2.5 px-0.5 text-xs text-[#77736D]">
                  <span className="text-[#171717] font-normal tracking-tight truncate max-w-[70%]">
                    {photo.title}
                  </span>
                  <span className="text-[11px] tracking-wide text-[#77736D]">
                    {photo.location || photo.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredPhotos.length === 0 && (
        <div className="py-20 text-center text-[#77736D] text-sm">
          No photographs found in this category.
        </div>
      )}

      {/* Clean Fullscreen Minimal Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        photos={filteredPhotos}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
      />
    </section>
  );
};
