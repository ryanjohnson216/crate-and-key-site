import React from "react";
import { BrandTheme } from "../types";
import { BrandLogo } from "./BrandLogo";
import { SERVICE_CITIES } from "../data/catalog";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterSectionProps {
  theme: BrandTheme;
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
  onNavigateToTerms?: () => void;
  onOpenAdminSync?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  theme,
  onOpenCheckout,
  onOpenQuiz,
  onNavigateToTerms,
  onOpenAdminSync,
}) => {
  const isWarm = theme === "warm-friendly";

  return (
    <footer className="bg-[#2D2A26] text-[#A08E79] pt-6 sm:pt-8 pb-6 sm:pb-8 border-t border-[#3E362E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Top Grid: Brand, Links, Service Cities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-5 sm:pb-6 border-b border-[#3E362E]">
          
          {/* Brand & Local Pitch (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-[#FDFBF7] p-2.5 rounded-xl inline-block shadow-xs">
              <BrandLogo theme={theme} size="md" />
            </div>

            <p className="text-[#A08E79] text-xs leading-relaxed max-w-sm">
              Crate &amp; Key is Central Illinois' go-to reusable tote rental service. Delivering clean, crushproof totes to your door in Washington and surrounding Central Illinois communities.
            </p>

            <div className="space-y-1.5 text-xs text-[#EBE3D5]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A08E79] shrink-0" />
                <span>Washington, IL</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A08E79] shrink-0" />
                <span>Call/Text: <a href="tel:3098865202" className="hover:text-white transition">(309) 886-5202</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A08E79] shrink-0" />
                <a href="mailto:hello@crateandkey.com" className="hover:text-white transition">hello@crateandkey.com</a>
              </div>
            </div>
          </div>

          {/* Quick Site Links (4 cols) - 2 Columns */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[#EBE3D5] font-serif font-bold text-base tracking-wide">
              Quick Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#A08E79]">
              <li>
                <a href="#why-totes" className="hover:text-white transition">Why Reusable Totes</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition">Pricing &amp; Bundles</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">FAQ</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenQuiz}
                  className="text-[#A08E79] font-semibold hover:underline transition text-left"
                >
                  Tote Calculator Quiz
                </button>
              </li>
              <li>
                <a
                  href="https://crateandkey.com/aboutus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  About Us
                </a>
              </li>
              {onNavigateToTerms && (
                <li className="col-span-2">
                  <button
                    type="button"
                    onClick={onNavigateToTerms}
                    className="hover:text-white transition text-left"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Service Area Cities List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[#EBE3D5] font-serif font-bold text-base tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A08E79]" />
              <span>Service Area</span>
            </h4>
            <p className="text-xs text-[#A08E79]">
              Proudly serving the Central Illinois communities we live, work, and play in.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {SERVICE_CITIES.map((city, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-[#3E362E] text-[#EBE3D5] border border-[#5E5449]"
                >
                  {city}, IL
                </span>
              ))}
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#5A6B5D]/40 text-[#EBE3D5] border border-[#5A6B5D]">
                + All surrounding Central IL towns
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A08E79]">
          <div>
            © {new Date().getFullYear()} Crate &amp; Key. All rights reserved. Washington, Illinois.
          </div>
        </div>

      </div>
    </footer>
  );
};
