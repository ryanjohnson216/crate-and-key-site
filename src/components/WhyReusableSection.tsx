import React from "react";
import { BrandTheme } from "../types";
import { Check } from "lucide-react";

interface WhyReusableSectionProps {
  theme: BrandTheme;
}

export const WhyReusableSection: React.FC<WhyReusableSectionProps> = () => {
  const columnItems = [
    "Crushproof durability",
    "Zero box assembly",
    "Saves money vs. cardboard",
    "Zero waste"
  ];
  const fullWidthItem = "Doorstep delivery & pickup available";

  return (
    <section id="why-totes" className="py-6 sm:py-10 bg-[#FDFBF7] border-b border-[#EBE3D5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <h2 className="text-2xl sm:text-3xl font-serif text-[#2D2A26] tracking-tight mb-4 sm:mb-6">
          Why Reusable Crates?
        </h2>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {columnItems.map((headerText, idx) => (
            <div
              key={idx}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#F5F2ED] border border-[#EBE3D5] text-[#2D2A26] font-semibold text-xs sm:text-sm shadow-2xs text-center"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A6B5D] shrink-0" />
              <span>{headerText}</span>
            </div>
          ))}
        </div>

        {/* Full-width item spanning bottom */}
        <div className="mt-2.5 sm:mt-3.5 flex justify-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#F5F2ED] border border-[#EBE3D5] text-[#2D2A26] font-semibold text-xs sm:text-sm shadow-2xs text-center w-full sm:w-auto">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A6B5D] shrink-0" />
            <span>{fullWidthItem}</span>
          </div>
        </div>

      </div>
    </section>
  );
};

