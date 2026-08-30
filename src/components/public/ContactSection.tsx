import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { ContactSettings, SocialLink, HomepageSettings } from '../../types';

interface ContactSectionProps {
  contact?: ContactSettings;
  socialLinks?: SocialLink[];
  homepage?: HomepageSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contact,
  socialLinks = [],
  homepage
}) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', projectType: 'Brand Collaboration' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rawPhone = contact?.whatsappNumber || '+977 9800000000';
  const cleanWhatsappNumber = rawPhone.replace(/[^0-9]/g, '');
  const whatsappMsg = contact?.whatsappMessage || "Hi Liyana, I came across your portfolio website and would love to collaborate.";
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      const prefill = `Hi Liyana, my name is ${formState.name} (${formState.email}). I am inquiring regarding ${formState.projectType}: ${formState.message}`;
      window.open(`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(prefill)}`, '_blank');
    }, 600);
  };

  return (
    <section
      id="contact"
      className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
        
        {/* Left Editorial Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-2">
              Inquiries & Work
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-normal text-[#171717] tracking-tight mb-6">
              Get in touch
            </h2>

            <p className="text-sm sm:text-base text-[#77736D] font-light leading-relaxed mb-8">
              {contact?.availabilityMessage || "Open for select creative partnerships, brand shoots, lifestyle features, and visual storytelling."}
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[#77736D]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#171717] font-medium block mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${contact?.email || 'contact@liyanashrestha.com'}`}
                  className="text-[#171717] hover:text-[#77736D] transition-colors"
                >
                  {contact?.email || 'contact@liyanashrestha.com'}
                </a>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#171717] font-medium block mb-1">
                  Direct WhatsApp
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[#171717] hover:text-[#77736D] transition-colors"
                >
                  <span>{contact?.whatsappNumber || '+977 9800000000'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#171717] font-medium block mb-1">
                  Turnaround
                </span>
                <span>{contact?.durationInfo || "Typical production turnaround: 5–10 days"}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#E6E3DD] text-xs text-[#77736D]">
            Based in Kathmandu, Nepal. Working worldwide.
          </div>
        </motion.div>

        {/* Right Clean Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7"
        >
          {submitted ? (
            <div className="p-8 sm:p-12 border border-[#E6E3DD] bg-white/40 text-center">
              <div className="w-10 h-10 rounded-full border border-[#171717] flex items-center justify-center mx-auto mb-4 text-[#171717]">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal text-[#171717] mb-2">Message Sent</h3>
              <p className="text-sm text-[#77736D] mb-6">
                Thank you for reaching out. We will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-widest text-[#171717] hover:text-[#77736D] transition-colors underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#171717] mb-2">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-white border border-[#E6E3DD] px-4 py-3 text-sm text-[#171717] placeholder-[#A8A49C] focus:outline-none focus:border-[#171717] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-[#171717] mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-[#E6E3DD] px-4 py-3 text-sm text-[#171717] placeholder-[#A8A49C] focus:outline-none focus:border-[#171717] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-type" className="block text-xs uppercase tracking-wider text-[#171717] mb-2">
                  Project Type
                </label>
                <select
                  id="contact-type"
                  value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className="w-full bg-white border border-[#E6E3DD] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  <option value="Brand Collaboration">Brand Collaboration</option>
                  <option value="Creative Shoot / Editorial">Creative Shoot / Editorial</option>
                  <option value="Travel & Lifestyle Feature">Travel & Lifestyle Feature</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#171717] mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me a bit about your idea, timing, or vision..."
                  className="w-full bg-white border border-[#E6E3DD] px-4 py-3 text-sm text-[#171717] placeholder-[#A8A49C] focus:outline-none focus:border-[#171717] transition-colors resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#171717] hover:text-[#77736D] transition-colors py-2"
              >
                <span>{submitting ? 'Sending...' : 'Send message'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
