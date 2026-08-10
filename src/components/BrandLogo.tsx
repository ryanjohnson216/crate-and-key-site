import React from "react";
import { BrandTheme } from "../types";

interface BrandLogoProps {
  theme?: BrandTheme;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  theme = "warm-friendly",
  className = "",
  size = "md"
}) => {
  const isWarm = theme === "warm-friendly";

  const sizeClasses = {
    sm: "h-7 text-lg gap-2",
    md: "h-9 text-xl gap-2.5",
    lg: "h-12 text-2xl gap-3",
  }[size];

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  }[size];

  return (
    <div className={`inline-flex items-center font-semibold tracking-tight ${sizeClasses} ${className}`}>
      {/* Custom Vector Icon: Tote box with Key handle motif */}
      <div
        className={`${iconSizes} rounded-lg flex items-center justify-center transition-colors shadow-xs ${
          isWarm
            ? "bg-[#5A6B5D] text-white"
            : "bg-[#2D2A26] text-[#A08E79]"
        }`}
      >
        <svg
          className="w-3/4 h-3/4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Tote Box Outline */}
          <path d="M21 8H3l1.2 11.2A2 2 0 0 0 6.18 21h11.64a2 2 0 0 0 1.98-1.8L21 8z" />
          <path d="M3 8l1.8-3.6A1.5 1.5 0 0 1 6.14 3.6h11.72a1.5 1.5 0 0 1 1.34.8L21 8" />
          <line x1="3" y1="8" x2="21" y2="8" />
          {/* Keyhole / Key Handle motif inside tote */}
          <circle cx="12" cy="13" r="1.8" fill="currentColor" opacity="0.9" />
          <path d="M12 14.8v3.2" strokeWidth="2.2" />
          <path d="M12 16.5h1.8" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-bold tracking-tight text-[#2D2A26] flex items-center gap-1">
          <span>Crate</span>
          <span className="text-[#5A6B5D] font-serif italic">&amp;</span>
          <span>Key</span>
        </span>
        <span className="text-[10px] font-medium tracking-wide uppercase text-[#A08E79] mt-0.5">
          Moving Tote Rentals
        </span>
      </div>
    </div>
  );
};
