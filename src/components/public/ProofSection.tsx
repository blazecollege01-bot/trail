import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { ProofItem, HomepageSettings } from '../../types';

interface ProofSectionProps {
  proofs: ProofItem[];
  homepage: HomepageSettings;
}

export const ProofSection: React.FC<ProofSectionProps> = ({ proofs, homepage }) => {
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);
  const sortedProofs = [...proofs].sort((a, b) => a.order - b.order);

  if (sortedProofs.length === 0) return null;

  return (
    <section id="proof" className="py-[38px] px-6 sm:px-8 md:px-12 max-w-7xl mx-auto border-t border-[#E6E3DD]">
      <div className="mb-10 sm:mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.2em] text-[#77736D] font-medium block mb-3"
        >
          Selected Collaborations
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-sans font-normal text-[#171717] tracking-tight"
        >
          {homepage.proofHeading || "Features & brand work"}
        </motion.h2>
      </div>

      {/* Clean Editorial Grid of Collaborations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {sortedProofs.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.08 * index }}
            onClick={() => setSelectedProof(item)}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE7E0] mb-4">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="flex items-baseline justify-between text-xs text-[#77736D] mb-1">
              <span className="uppercase tracking-wider text-[11px] font-medium text-[#171717]">
                {item.clientOrContext}
              </span>
              <span className="text-[11px] group-hover:text-[#171717] inline-flex items-center gap-0.5 transition-colors">
                View <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

            <h3 className="text-base font-normal text-[#171717] tracking-tight leading-snug">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-xs text-[#77736D] font-light mt-1.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Minimal modal viewer */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F7F4]/98 backdrop-blur-md p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative max-w-4xl w-full bg-[#F8F7F4] border border-[#E6E3DD] shadow-lg overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedProof(null)}
                className="absolute top-4 right-4 z-20 p-2 text-[#171717] hover:text-[#77736D] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-3/5 bg-[#EAE7E0] flex items-center justify-center">
                <img
                  src={selectedProof.image}
                  alt={selectedProof.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#77736D] block mb-2 font-medium">
                    {selectedProof.clientOrContext}
                  </span>
                  <h3 className="text-xl font-normal text-[#171717] tracking-tight mb-4">
                    {selectedProof.title}
                  </h3>
                  <p className="text-sm text-[#77736D] font-light leading-relaxed">
                    {selectedProof.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E6E3DD] text-xs text-[#77736D]">
                  Selected portfolio feature
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
