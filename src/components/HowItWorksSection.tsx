import React from "react";
import { BrandTheme } from "../types";
import { HOW_IT_WORKS_STEPS } from "../data/catalog";

interface HowItWorksSectionProps {
  theme: BrandTheme;
  onOpenCheckout: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  return (
    <section id="how-it-works" className="py-6 sm:py-16 bg-[#F5F2ED] border-b border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif text-[#2D2A26] tracking-tight leading-tight">
            What to Expect
          </h2>
        </div>

        {/* Numbered Steps Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-[#FDFBF7] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EBE3D5] shadow-xs relative flex items-center gap-2.5 sm:gap-3.5"
            >
              {/* Step Number Circle */}
              <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#E5DCCF] text-[#5A6B5D] font-bold text-xs sm:text-base flex items-center justify-center shrink-0">
                {item.step}
              </div>

              <h3 className="text-xs sm:text-base font-bold text-[#2D2A26] leading-snug">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
