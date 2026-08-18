import React, { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { BrandTheme, CartItem } from "../types";
import { ShoppingBag, Facebook, Instagram, Menu, X } from "lucide-react";

interface NavbarProps {
  theme: BrandTheme;
  setTheme: (t: BrandTheme) => void;
  cart: CartItem[];
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
  onNavigateHome?: () => void;
  onNavigateToFaq?: () => void;
  onNavigateToAbout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  cart,
  onOpenCheckout,
  onNavigateHome,
  onNavigateToFaq,
  onNavigateToAbout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE3D5]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            if (onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
            closeMenu();
          }}
          className="flex items-center group"
        >
          <BrandLogo theme={theme} size="md" />
        </a>

        {/* Right CTA Button, Socials & Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Social Icons - Always visible */}
          <div className="flex items-center gap-1 border-r border-[#EBE3D5] pr-2 sm:pr-3">
            <a
              href="https://www.facebook.com/crateandkey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg text-[#8C7B68] hover:text-[#2D2A26] hover:bg-[#EBE3D5]/60 transition-colors"
              title="Facebook"
              aria-label="Facebook Page"
            >
              <Facebook className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
            <a
              href="https://www.instagram.com/crate-and-key"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg text-[#8C7B68] hover:text-[#2D2A26] hover:bg-[#EBE3D5]/60 transition-colors"
              title="Instagram"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          </div>

          {/* Reserve Totes CTA */}
          <button
            type="button"
            onClick={() => {
              onOpenCheckout();
              closeMenu();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-150 bg-[#A08E79] hover:bg-[#8C7B68] text-white active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Reserve totes</span>
            <span className="xs:hidden">Reserve</span>
            {totalCartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2D2A26] text-[#A08E79]">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl text-[#2D2A26] bg-[#EBE3D5]/60 hover:bg-[#EBE3D5] transition-colors focus:outline-none cursor-pointer"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[#2D2A26]" />
            ) : (
              <Menu className="w-5 h-5 text-[#2D2A26]" />
            )}
          </button>

        </div>

      </div>

      {/* Hamburger Dropdown Navigation Menu */}
      {isMenuOpen && (
        <div className="bg-[#FDFBF7] border-b border-[#EBE3D5] shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2 text-sm font-medium text-[#5E5449]">
            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="block px-3 py-2.5 rounded-xl hover:bg-[#EBE3D5]/50 hover:text-[#2D2A26] transition-colors font-semibold"
            >
              How it works
            </a>
            <a
              href="#catalog"
              onClick={closeMenu}
              className="block px-3 py-2.5 rounded-xl hover:bg-[#EBE3D5]/50 hover:text-[#2D2A26] transition-colors font-semibold"
            >
              Packages &amp; Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                if (onNavigateToFaq) {
                  e.preventDefault();
                  onNavigateToFaq();
                }
                closeMenu();
              }}
              className="block px-3 py-2.5 rounded-xl hover:bg-[#EBE3D5]/50 hover:text-[#2D2A26] transition-colors font-semibold"
            >
              Frequently Asked Questions (FAQ)
            </a>
            <a
              href="#about"
              onClick={(e) => {
                if (onNavigateToAbout) {
                  e.preventDefault();
                  onNavigateToAbout();
                }
                closeMenu();
              }}
              className="block px-3 py-2.5 rounded-xl hover:bg-[#EBE3D5]/50 hover:text-[#2D2A26] transition-colors font-semibold"
            >
              About Us
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                if (onNavigateHome) {
                  onNavigateHome();
                }
                closeMenu();
              }}
              className="block px-3 py-2.5 rounded-xl hover:bg-[#EBE3D5]/50 hover:text-[#2D2A26] transition-colors font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
