import React from "react";
import { BrandTheme } from "../types";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  theme: BrandTheme;
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCheckout,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FDFBF7] pt-4 sm:pt-8 lg:pt-12 pb-8 sm:pb-16 lg:pb-20 border-b border-[#EBE3D5]/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Column: Left-aligned Copy & Action CTA */}
          <div className="flex-1 text-left space-y-4 sm:space-y-5 max-w-2xl">
            
            {/* Headline */}
            <h1 className="text-2xl min-[380px]:text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2A26] tracking-tight leading-snug sm:leading-[1.18] text-left">
              <span className="block text-left">Moving is stressful.</span>
              <span className="italic block text-left">Packing doesn't have to be.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#5E5449] leading-relaxed text-left">
              Heavy-duty, reusable moving totes for your move in Central Illinois. Pack, move, and let us handle the rest. No cardboard, no tape, no waste.
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-start pt-1 w-full text-left">
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xs transition-all duration-150 bg-[#A08E79] hover:bg-[#8C7B68] text-white active:scale-[0.98]"
              >
                <span>Reserve Now</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

          </div>

          {/* Right Column: Hero Photo (Option B: Sized flush with text block) */}
          <div className="w-full sm:w-auto shrink-0 flex justify-center lg:justify-end items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#EBE3D5] bg-[#F3EFE6] w-full max-w-[280px] sm:max-w-[320px] lg:w-[275px] lg:h-[275px] aspect-square">
              <img
                src="/hero-front-door.jpg"
                alt="Crate & Key heavy duty plastic totes delivered at front door"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


