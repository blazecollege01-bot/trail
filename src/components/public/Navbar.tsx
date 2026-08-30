import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { ContactSettings, SocialLink } from '../../types';

interface NavbarProps {
  contact?: ContactSettings;
  socialLinks?: SocialLink[];
  whatsappNumber?: string;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ contact, socialLinks, whatsappNumber, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const rawPhone = contact?.whatsappNumber || whatsappNumber || '+977 9800000000';
  const cleanWhatsappNumber = rawPhone.replace(/[^0-9]/g, '');
  const whatsappMsg = contact?.whatsappMessage || "Hi Liyana, I'd love to connect";
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'intro', 'story', 'photography', 'about', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Story', href: '#story' },
    { name: 'Photography', href: '#photography' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Text color classes based on scroll state
  const brandColorClass = isScrolled ? 'text-[#171717]' : 'text-[#F8F7F4] drop-shadow-sm';
  const inactiveLinkColorClass = isScrolled ? 'text-[#77736D] hover:text-[#171717]' : 'text-[#F8F7F4]/80 hover:text-[#F8F7F4]';
  const activeLinkColorClass = isScrolled ? 'text-[#171717]' : 'text-[#F8F7F4]';
  const indicatorColorClass = isScrolled ? 'bg-[#171717]' : 'bg-[#F8F7F4]';
  const dividerColorClass = isScrolled ? 'bg-[#E6E3DD]' : 'bg-[#F8F7F4]/30';
  const iconColorClass = isScrolled ? 'text-[#77736D] hover:text-[#171717]' : 'text-[#F8F7F4]/75 hover:text-[#F8F7F4]';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F7F4]/92 backdrop-blur-md border-b border-[#E6E3DD] py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          : 'bg-gradient-to-b from-black/40 via-black/15 to-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Name Logo */}
        <a
          id="nav-brand"
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="group flex items-center gap-2"
        >
          <span className={`font-sans font-medium text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 ${brandColorClass}`}>
            LIYANA SHRESTHA
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => {
            const isActive = activeSection === item.name.toLowerCase();
            return (
              <a
                key={item.name}
                id={`nav-link-${item.name.toLowerCase()}`}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-[13px] font-medium tracking-wide transition-colors relative py-1 ${
                  isActive ? activeLinkColorClass : inactiveLinkColorClass
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className={`absolute -bottom-1 left-0 right-0 h-[1px] ${indicatorColorClass}`}
                  />
                )}
              </a>
            );
          })}

          <div className={`h-3 w-[1px] mx-1 transition-colors duration-300 ${dividerColorClass}`} />

          {/* Admin Lock Access */}
          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            aria-label="Open Studio Admin Portal"
            className={`transition-colors p-1 ${iconColorClass}`}
            title="Studio CMS"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            className={`p-2 transition-colors ${iconColorClass}`}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className={`p-2 transition-colors focus:outline-none ${isScrolled ? 'text-[#171717]' : 'text-[#F8F7F4]'}`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-[#F8F7F4] border-b border-[#E6E3DD] px-6 py-8 shadow-xl"
          >
            <nav className="flex flex-col space-y-5">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-base font-medium text-[#171717] hover:text-[#77736D] transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-[#E6E3DD] flex items-center justify-between text-xs text-[#77736D]">
                <span>Kathmandu, Nepal</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#171717] font-medium"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
