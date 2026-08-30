import React from 'react';
import { motion } from 'motion/react';
import { HomepageSettings } from '../../types';

interface IntroSectionProps {
  homepage: HomepageSettings;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ homepage }) => {
  const bgImage = homepage.introImage || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85";
  const quoteText = homepage.introQuote || "I create, explore and document the moments, places and people that inspire me.";
  const narrativeText = homepage.storyIntroText || "Through personal perspective, light, and visual stories across Kathmandu alleys and travels — capturing everyday life as it unfolds.";

  return (
    <section
      id="intro"
      className="relative w-full py-32 sm:py-36 md:py-40 min-h-[540px] sm:min-h-[620px] md:min-h-[80vh] flex items-center justify-center overflow-hidden group bg-[#121214]"
    >
      {/* 100% Full-Screen Width Background Image with subtle zoom on hover */}
      <img
        src={bgImage}
        alt="A little about me - Introduction"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05] group-hover:scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Sophisticated Dark Gradient & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Centered Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 md:px-16 text-center flex flex-col items-center justify-center py-16 sm:py-20">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 border border-[#F8F7F4]/20 bg-black/35 backdrop-blur-xs text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#F8F7F4]/90 font-medium"
        >
          <span>Introduction</span>
          <span className="text-[#c5a880]">•</span>
          <span>A little about me</span>
        </motion.div>

        {/* Centered Lead Quote / Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#F8F7F4] font-normal leading-[1.3] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] mb-6 max-w-3xl"
        >
          &ldquo;{quoteText}&rdquo;
        </motion.h2>

        {/* Subtle Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-12 h-[1px] bg-[#c5a880]/70 mb-6"
        />

        {/* Centered Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-xs sm:text-sm md:text-base text-[#F8F7F4]/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-sans"
        >
          {narrativeText}
        </motion.p>
      </div>
    </section>
  );
};
