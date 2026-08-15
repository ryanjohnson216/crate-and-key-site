import React from "react";
import { BrandLogo } from "./BrandLogo";
import { BrandTheme, CartItem } from "../types";
import { ShoppingBag } from "lucide-react";

interface NavbarProps {
  theme: BrandTheme;
  setTheme: (t: BrandTheme) => void;
  cart: CartItem[];
  onOpenCheckout: () => void;
  onOpenQuiz: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  cart,
  onOpenCheckout,
  onNavigateHome,
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
          }}
          className="flex items-center group"
        >
          <BrandLogo theme={theme} size="md" />
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5E5449]">
          <a href="#how-it-works" className="hover:text-[#2D2A26] transition-colors">
            How it works
          </a>
          <a href="#catalog" className="hover:text-[#2D2A26] transition-colors">
            Packages
          </a>
          <a href="#faq" className="hover:text-[#2D2A26] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all duration-150 bg-[#A08E79] hover:bg-[#8C7B68] text-white active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Reserve totes</span>
            <span className="xs:hidden sm:hidden">Reserve</span>
            {totalCartCount > 0 && (
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-[#2D2A26] text-[#A08E79]">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
