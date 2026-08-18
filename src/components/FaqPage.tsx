import React, { useState } from "react";
import { BrandTheme } from "../types";
import { BrandLogo } from "./BrandLogo";
import { FAQ_ITEMS } from "../data/catalog";
import { ArrowLeft, ChevronDown, HelpCircle, Calculator, Phone, Mail, ShoppingBag } from "lucide-react";

interface FaqPageProps {
  theme: BrandTheme;
  onNavigateHome: () => void;
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  theme,
  onNavigateHome,
  onOpenCheckout,
  onOpenQuiz,
}) => {
  // Accordion state (default first FAQ item open)
  const [openId, setOpenId] = useState<string>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E362E] font-sans antialiased pb-12">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE3D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5E5449] hover:text-[#2D2A26] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#A08E79]" />
            <span>Back to Home</span>
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="flex items-center justify-center"
          >
            <BrandLogo theme={theme} size="md" />
          </a>

          <button
            type="button"
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#A08E79] hover:bg-[#8C7B68] text-white text-xs sm:text-sm font-bold transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reserve Totes</span>
          </button>
        </div>
      </header>

      {/* Hero Banner Header */}
      <div className="bg-[#2D2A26] text-[#EBE3D5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#3E362E]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      {/* Main FAQ Accordion Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8">
        
        {/* Accordion List */}
        <div className="space-y-3">
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
                  className="w-full p-4 sm:p-5 text-left font-bold text-[#2D2A26] text-sm sm:text-base flex items-center justify-between gap-3 hover:bg-[#FDFBF7] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#5A6B5D] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A08E79] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#5A6B5D]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 text-[#5E5449] text-xs sm:text-sm leading-relaxed border-t border-[#EBE3D5] space-y-3 bg-[#FAF8F5]/50">
                    <p>{faq.answer}</p>

                    {faq.hasQuizLink && (
                      <div>
                        <button
                          type="button"
                          onClick={onOpenQuiz}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5DCCF] hover:bg-[#EBE3D5] text-[#5A6B5D] text-xs font-bold transition cursor-pointer"
                        >
                          <Calculator className="w-3.5 h-3.5 text-[#5A6B5D]" />
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

        {/* Tote Quiz Callout Banner */}
        <div className="bg-[#5A6B5D] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
              Not sure how many totes your move needs?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100">
              Take our 60-second interactive calculator quiz to get an accurate estimate for your home or business size.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenQuiz}
            className="px-5 py-2.5 rounded-xl bg-white text-[#2D2A26] hover:bg-[#F5F2ED] font-bold text-xs sm:text-sm transition shrink-0 shadow-xs cursor-pointer"
          >
            Take Tote Quiz
          </button>
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE3D5] text-center space-y-3 shadow-xs">
          <h4 className="font-serif font-bold text-[#2D2A26] text-lg sm:text-xl">
            Still have a question or custom delivery request?
          </h4>
          <p className="text-xs sm:text-sm text-[#5E5449] max-w-lg mx-auto">
            We're a local family-run business in Washington, IL. Give us a call, shoot us a text, or send us an email—we're happy to help!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-[#2D2A26]">
            <a
              href="tel:3098865202"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F2ED] hover:bg-[#EBE3D5] transition border border-[#EBE3D5]"
            >
              <Phone className="w-4 h-4 text-[#5A6B5D]" />
              <span>(309) 886-5202</span>
            </a>
            <a
              href="mailto:hello@crateandkey.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F2ED] hover:bg-[#EBE3D5] transition border border-[#EBE3D5]"
            >
              <Mail className="w-4 h-4 text-[#5A6B5D]" />
              <span>hello@crateandkey.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-4 flex items-center justify-between border-t border-[#EBE3D5]">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-[#EBE3D5] hover:bg-[#D9CEBA] text-xs font-bold text-[#2D2A26] transition cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#5A6B5D]" />
            <span>Return to Home Page</span>
          </button>

          <button
            type="button"
            onClick={onOpenCheckout}
            className="px-5 py-2 rounded-xl bg-[#A08E79] hover:bg-[#8C7B68] text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            Reserve Your Totes Now
          </button>
        </div>

      </main>
    </div>
  );
};
