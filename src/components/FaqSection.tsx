import React, { useState } from "react";
import { BrandTheme } from "../types";
import { FAQ_ITEMS } from "../data/catalog";
import { ChevronDown, HelpCircle, Calculator } from "lucide-react";

interface FaqSectionProps {
  theme: BrandTheme;
  onOpenQuiz: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ theme, onOpenQuiz }) => {
  const isWarm = theme === "warm-friendly";

  // Accordion open state (default first item open)
  const [openId, setOpenId] = useState<string>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <section id="faq" className="py-6 sm:py-16 bg-[#F5F2ED] border-b border-[#EBE3D5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif text-[#2D2A26] tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-2 sm:space-y-3">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-[#EBE3D5] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 sm:p-5 text-left font-bold text-[#2D2A26] text-xs sm:text-base flex items-center justify-between gap-2.5 hover:bg-[#FDFBF7] transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A6B5D] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A08E79] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#5A6B5D]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-1 text-[#5E5449] text-xs sm:text-sm leading-relaxed border-t border-[#EBE3D5] space-y-2 sm:space-y-3">
                    <p>{faq.answer}</p>

                    {faq.hasQuizLink && (
                      <div>
                        <button
                          type="button"
                          onClick={onOpenQuiz}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#E5DCCF] hover:bg-[#EBE3D5] text-[#5A6B5D] text-[10px] sm:text-xs font-bold transition"
                        >
                          <Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5A6B5D]" />
                          <span>Launch 1-Minute Tote Quiz</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#FDFBF7] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#EBE3D5] text-center space-y-1.5 sm:space-y-2">
          <h4 className="font-bold text-[#2D2A26] text-sm sm:text-base">
            Have a question or custom delivery request?
          </h4>
          <p className="text-[11px] sm:text-xs text-[#5E5449]">
            We're a local business in Washington. Call or text us anytime at <a href="tel:3098865202" className="font-bold text-[#2D2A26] hover:underline">(309) 886-5202</a> or email <a href="mailto:hello@crateandkey.com" className="font-bold text-[#2D2A26] hover:underline">hello@crateandkey.com</a>.
          </p>
        </div>

      </div>
    </section>
  );
};
