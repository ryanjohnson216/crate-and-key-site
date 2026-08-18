import React from "react";
import { BrandTheme } from "../types";
import { BrandLogo } from "./BrandLogo";
import { SERVICE_CITIES } from "../data/catalog";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

interface FooterSectionProps {
  theme: BrandTheme;
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToFaq?: () => void;
  onNavigateToAbout?: () => void;
  onOpenAdminSync?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  theme,
  onOpenCheckout,
  onOpenQuiz,
  onNavigateToTerms,
  onNavigateToFaq,
  onNavigateToAbout,
  onOpenAdminSync,
}) => {
  const isWarm = theme === "warm-friendly";

  return (
    <footer className="bg-[#2D2A26] text-[#A08E79] pt-6 sm:pt-8 pb-6 sm:pb-8 border-t border-[#3E362E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* Top Grid: Brand & Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-5 sm:pb-6 border-b border-[#3E362E]">
          
          {/* Brand & Local Pitch (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-[#FDFBF7] p-2.5 rounded-xl inline-block shadow-xs">
              <BrandLogo theme={theme} size="md" />
            </div>

            <p className="text-[#A08E79] text-xs leading-relaxed max-w-md">
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

            {/* Social Media Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <a
                href="https://www.facebook.com/crateandkey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E362E] hover:bg-[#5A6B5D] text-[#EBE3D5] hover:text-white transition border border-[#5E5449] font-medium"
                aria-label="Facebook - www.facebook.com/crateandkey"
              >
                <Facebook className="w-3.5 h-3.5 text-[#A08E79]" />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/crate-and-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E362E] hover:bg-[#5A6B5D] text-[#EBE3D5] hover:text-white transition border border-[#5E5449] font-medium"
                aria-label="Instagram - @crate-and-key"
              >
                <Instagram className="w-3.5 h-3.5 text-[#A08E79]" />
                <span>@crate-and-key</span>
              </a>
            </div>
          </div>

          {/* Quick Site Links (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-[#EBE3D5] font-serif font-bold text-base tracking-wide">
              Quick Navigation
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-[#A08E79]">
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
                <a
                  href="#faq"
                  onClick={(e) => {
                    if (onNavigateToFaq) {
                      e.preventDefault();
                      onNavigateToFaq();
                    }
                  }}
                  className="hover:text-white transition"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">Contact Us</a>
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
                  href="#about"
                  onClick={(e) => {
                    if (onNavigateToAbout) {
                      e.preventDefault();
                      onNavigateToAbout();
                    }
                  }}
                  className="hover:text-white transition cursor-pointer"
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

        </div>

        {/* Full Width Service Area Section */}
        <div className="pb-5 sm:pb-6 border-b border-[#3E362E] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-[#EBE3D5] font-serif font-bold text-base tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A08E79]" />
              <span>Service Area</span>
            </h4>
            <p className="text-xs text-[#A08E79]">
              Proudly serving the Central Illinois communities we live, work, and play in.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {SERVICE_CITIES.map((city, idx) => (
              <span
                key={idx}
                className={`text-[11px] px-3 py-1 rounded-lg border ${
                  city === "Washington"
                    ? "bg-[#A08E79] text-white font-bold border-[#A08E79] shadow-xs"
                    : "bg-[#3E362E] text-[#EBE3D5] border-[#5E5449]"
                }`}
              >
                {city}, IL
              </span>
            ))}
            <span className="text-[11px] px-3 py-1 rounded-lg bg-[#5A6B5D]/40 text-[#EBE3D5] border border-[#5A6B5D] font-medium">
              + All surrounding Central IL towns
            </span>
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
