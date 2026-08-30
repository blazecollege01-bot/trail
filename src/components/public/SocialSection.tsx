import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SocialLink } from '../../types';

interface SocialSectionProps {
  socialLinks: SocialLink[];
}

export const SocialSection: React.FC<SocialSectionProps> = ({ socialLinks }) => {
  const enabledLinks = [...socialLinks]
    .filter((l) => l.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <section
      id="social"
      className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]"
    >
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:w-1/3"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-3">
            Socials & Channels
          </span>
          <h2 className="text-xl sm:text-2xl font-sans font-normal text-[#171717] tracking-tight">
            Follow the journey
          </h2>
        </motion.div>

        {/* Minimal Text Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:w-2/3 flex flex-wrap gap-x-10 gap-y-4 items-center"
        >
          {enabledLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-normal text-[#171717] hover:text-[#77736D] transition-colors py-1 relative"
            >
              <span className="border-b border-transparent group-hover:border-[#77736D] transition-all">
                {link.label || link.platform}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
