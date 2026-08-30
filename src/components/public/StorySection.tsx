import React from 'react';
import { motion } from 'motion/react';
import { StoryChapter, HomepageSettings } from '../../types';

interface StorySectionProps {
  stories: StoryChapter[];
  homepage: HomepageSettings;
}

export const StorySection: React.FC<StorySectionProps> = ({ stories, homepage }) => {
  const sortedStories = [...stories].sort((a, b) => a.order - b.order);

  return (
    <section id="story" className="w-full my-[38px]">
      {/* Subtle Section Header */}
      <div className="py-8 sm:py-10 text-center max-w-2xl mx-auto px-6 mb-[38px]">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.25em] text-[#77736D] font-medium block mb-2"
        >
          Selected Chapters
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal text-[#171717] tracking-tight"
        >
          {homepage.storyIntroHeading || "Stories & moments"}
        </motion.h2>
      </div>

      {/* Chapters list: 100% Full-Screen Width Banners with 1cm (~38px) space between each chapter */}
      <div className="w-full flex flex-col space-y-[38px]">
        {sortedStories.map((chapter, index) => {
          const chapterNum = chapter.chapterNumber || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);

          return (
            <motion.div
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[480px] sm:min-h-[560px] md:min-h-[75vh] w-full flex items-center justify-center overflow-hidden group shadow-lg"
            >
              {/* 100% Full-Bleed Background Image with elegant hover zoom */}
              <img
                src={chapter.image}
                alt={chapter.heading || chapter.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.74] contrast-[1.06] group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Atmospheric Gradient & Dark Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85 pointer-events-none" />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* Centered Editorial Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 md:px-16 text-center flex flex-col items-center justify-center py-16 sm:py-24">
                {/* Chapter Number & Title Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 border border-[#F8F7F4]/20 bg-black/40 backdrop-blur-xs text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#F8F7F4]/90 font-medium"
                >
                  <span>CHAPTER {chapterNum}</span>
                  <span className="text-[#c5a880]">•</span>
                  <span>{chapter.title}</span>
                </motion.div>

                {/* Chapter Main Heading */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-normal text-[#F8F7F4] tracking-tight leading-[1.25] mb-5 max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]"
                >
                  {chapter.heading || chapter.title}
                </motion.h3>

                {/* Delicate Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="w-12 h-[1px] bg-[#c5a880]/70 my-3"
                />

                {/* Chapter Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-xs sm:text-sm md:text-base text-[#F8F7F4]/90 font-light leading-relaxed max-w-2xl mx-auto mb-6 drop-shadow-sm font-sans"
                >
                  {chapter.description}
                </motion.p>

                {/* Pull Quote if available */}
                {chapter.quote && (
                  <motion.blockquote
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="italic font-serif text-sm sm:text-base md:text-lg text-[#F8F7F4]/95 max-w-xl mx-auto py-2.5 border-t border-b border-[#F8F7F4]/20 drop-shadow-sm mt-1"
                  >
                    &ldquo;{chapter.quote}&rdquo;
                  </motion.blockquote>
                )}
              </div>

              {/* Image Caption metadata pill */}
              {chapter.imageCaption && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-[10px] sm:text-xs text-[#F8F7F4]/75 tracking-wider font-light uppercase bg-black/40 backdrop-blur-xs px-3.5 py-1 border border-white/10">
                  {chapter.imageCaption}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
