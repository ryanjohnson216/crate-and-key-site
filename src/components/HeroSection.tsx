import React from "react";
import { BrandTheme } from "../types";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";

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
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Action CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Small Location Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5A6B5D]/10 border border-[#5A6B5D]/20 text-[#5A6B5D] text-xs font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Central Illinois Reusable Moving Tote Rentals</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl font-serif text-[#2D2A26] tracking-tight leading-snug sm:leading-[1.15]">
              <span className="block">Moving is stressful.</span>
              <span className="italic block">Packing doesn't have to be.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-xl text-[#5E5449] leading-relaxed max-w-2xl">
              Heavy-duty, reusable moving totes for your move in Central Illinois. Pack, move, and let us handle the rest. No cardboard, no tape, no waste.
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-[#2D2A26] pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B5D] shrink-0" />
                <span>Zero Cardboard or Tape</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B5D] shrink-0" />
                <span>Heavy-Duty &amp; Stackable</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B5D] shrink-0" />
                <span>Free Doorstep Pickup</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2 w-full">
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

          {/* Right Column: Hero Delivery Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#EBE3D5] bg-[#16202D] aspect-[4/5] sm:aspect-[3/4] max-h-[480px] sm:max-h-none w-full group">
              <img
                src="/hero-front-door.jpg"
                alt="Crate & Key heavy duty plastic totes delivered at front door with Welcome sign"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#EBE3D5] shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5A6B5D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#2D2A26] text-xs sm:text-sm leading-tight">
                      Porch Delivery Included
                    </div>
                    <div className="text-[11px] text-[#5E5449]">
                      Washington, Peoria, Dunlap &amp; surrounding Central IL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

