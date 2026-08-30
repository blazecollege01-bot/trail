import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { HomepageSettings } from '../../types';

interface HeroProps {
  homepage: HomepageSettings;
}

export const Hero: React.FC<HeroProps> = ({ homepage }) => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* Full-Screen Background Image with Refined Vignette/Overlay */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#121214]">
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={homepage.heroImage}
          alt={homepage.heroTitle || "Liyana Shrestha"}
          className="w-full h-full object-cover object-[center_35%] filter brightness-[0.88] contrast-[1.04]"
          loading="eager"
        />

        {/* Sophisticated Classy Tint & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none backdrop-brightness-[0.96]" />
      </div>

      {/* Center Aligned Editorial Details with Classy Staggered Entrance */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center">
        {/* Subtitle / Role */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#F8F7F4]/80 font-medium mb-4 sm:mb-6"
        >
          {homepage.heroSubtitle || "Digital creator & visual storyteller"}
        </motion.p>

        {/* Centered Main Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-normal text-[#F8F7F4] tracking-tight leading-[1.06] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        >
          {homepage.heroTitle || "Liyana Shrestha"}
        </motion.h1>

        {/* Location & Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col items-center max-w-lg mb-8 sm:mb-10"
        >
          <span className="text-xs sm:text-sm text-[#F8F7F4]/75 font-light tracking-wide mb-3">
            Based in Kathmandu, Nepal
          </span>

          {homepage.heroStatement && (
            <p className="text-xs sm:text-sm text-[#F8F7F4]/85 font-light leading-relaxed max-w-md italic font-serif">
              &ldquo;{homepage.heroStatement}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Minimal Classy Center CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-6"
        >
          <a
            id="hero-explore-cta"
            href="#photography"
            onClick={(e) => handleScrollTo(e, '#photography')}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 border border-[#F8F7F4]/40 hover:border-[#F8F7F4] text-xs sm:text-sm text-[#F8F7F4] tracking-[0.15em] uppercase font-medium bg-black/20 hover:bg-white/10 backdrop-blur-xs transition-all duration-300"
          >
            <span>Explore my work</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt at Bottom Center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <a
          href="#intro"
          onClick={(e) => handleScrollTo(e, '#intro')}
          className="text-[#F8F7F4]/60 hover:text-[#F8F7F4] transition-colors p-2 flex flex-col items-center gap-1.5"
          aria-label="Scroll down"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
