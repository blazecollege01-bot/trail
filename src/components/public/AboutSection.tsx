import React from 'react';
import { motion } from 'motion/react';
import { AboutData, HomepageSettings } from '../../types';

interface AboutSectionProps {
  about: AboutData;
  homepage: HomepageSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about, homepage }) => {
  return (
    <section
      id="about"
      className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
        
        {/* Left: Portrait Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden bg-[#EAE7E0] aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
            <img
              src={about.portraitImage}
              alt={about.name || "Liyana Shrestha"}
              loading="lazy"
              className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98]"
            />
          </div>
        </motion.div>

        {/* Right: Spacious Editorial Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col justify-center max-w-xl"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-3">
            About
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-normal text-[#171717] tracking-tight mb-4">
            {about.name || "Liyana Shrestha"}
          </h2>

          {/* Role & Categories */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#77736D] mb-6">
            <span>Digital creator</span>
            <span>•</span>
            <span>Lifestyle</span>
            <span>•</span>
            <span>Photography</span>
            <span>•</span>
            <span className="text-[#171717]">{about.location || "Kathmandu, Nepal"}</span>
          </div>

          {/* Short Bio Statement */}
          {about.shortBio && (
            <p className="font-serif text-lg sm:text-xl text-[#171717] font-normal leading-relaxed mb-6">
              &ldquo;{about.shortBio}&rdquo;
            </p>
          )}

          {/* Full Bio */}
          <p className="text-sm sm:text-base text-[#77736D] font-light leading-relaxed mb-8">
            {about.fullBio}
          </p>

          {/* Highlights / Focus if available */}
          {about.highlights && about.highlights.length > 0 && (
            <div className="pt-6 border-t border-[#E6E3DD] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#77736D]">
              {about.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#171717] rounded-full shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
