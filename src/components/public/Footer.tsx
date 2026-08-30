import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { SocialLink, SiteSettings } from '../../types';

interface FooterProps {
  socialLinks: SocialLink[];
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ socialLinks, settings, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enabledLinks = [...socialLinks].filter((l) => l.enabled).sort((a, b) => a.order - b.order);

  return (
    <footer className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-12">
        <div>
          <span className="font-sans font-medium text-xs tracking-[0.18em] uppercase text-[#171717] block mb-1">
            LIYANA SHRESTHA
          </span>
          <p className="text-xs text-[#77736D] font-light">
            Digital creator & visual storyteller • Kathmandu, Nepal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#77736D]">
          {enabledLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#171717] transition-colors"
            >
              {link.label || link.platform}
            </a>
          ))}

          <button
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="hover:text-[#171717] transition-colors inline-flex items-center gap-1"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-[#E6E3DD]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736D] gap-4">
        <p>© {new Date().getFullYear()} Liyana Shrestha. All rights reserved.</p>

        <button
          onClick={onOpenAdmin}
          className="hover:text-[#171717] transition-colors inline-flex items-center gap-1.5 opacity-60 hover:opacity-100"
        >
          <Lock className="w-3 h-3" />
          <span>Studio CMS</span>
        </button>
      </div>
    </footer>
  );
};
