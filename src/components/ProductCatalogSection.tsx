import React, { useState } from "react";
import { BrandTheme, CartItem } from "../types";
import { TOTE_PACKAGES, ADD_ON_ITEMS, BASE_TOTE_RATE_2WEEKS } from "../data/catalog";
import { Check, Plus, ShoppingBag, HelpCircle, Sparkles, Layers, Box, Truck, Shirt, Shield, Scissors, Wrench } from "lucide-react";

interface ProductCatalogSectionProps {
  theme: BrandTheme;
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onOpenQuiz: () => void;
  onOpenCheckout: () => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  theme,
  cart,
  onAddToCart,
  onOpenQuiz,
  onOpenCheckout,
}) => {
  const isWarm = theme === "warm-friendly";

  // Custom Tote Counter
  const [customToteCount, setCustomToteCount] = useState<number>(30);

  const isItemInCart = (id: string) => cart.some((c) => c.id === id);

  const getAddOnIcon = (iconName: string) => {
    switch (iconName) {
      case "Truck":
        return <Truck className="w-5 h-5 text-[#5A6B5D]" />;
      case "Shirt":
        return <Shirt className="w-5 h-5 text-[#5A6B5D]" />;
      case "Shield":
        return <Shield className="w-5 h-5 text-[#5A6B5D]" />;
      case "Scissors":
        return <Scissors className="w-5 h-5 text-[#5A6B5D]" />;
      case "Wrench":
        return <Wrench className="w-5 h-5 text-[#5A6B5D]" />;
      default:
        return <Box className="w-5 h-5 text-[#5A6B5D]" />;
    }
  };

  const handleAddPackage = (pkg: typeof TOTE_PACKAGES[0]) => {
    onAddToCart({
      id: pkg.id,
      name: pkg.name,
      type: "package",
      quantity: 1,
      pricePerUnit: pkg.basePrice2Weeks,
      toteCount: pkg.toteCount,
      details: `${pkg.toteCount} heavy-duty totes (2-week rental)`,
    });
  };

  const handleAddCustomTotes = () => {
    if (customToteCount < 1) return;
    const price = customToteCount * BASE_TOTE_RATE_2WEEKS;
    onAddToCart({
      id: `custom-totes-${customToteCount}`,
      name: `Custom Tote Quantity (${customToteCount} Totes)`,
      type: "custom",
      quantity: 1,
      pricePerUnit: price,
      toteCount: customToteCount,
      details: `${customToteCount} plastic totes ($${BASE_TOTE_RATE_2WEEKS}/tote for 2 weeks)`,
    });
  };

  const handleAddAddOn = (addon: typeof ADD_ON_ITEMS[0]) => {
    onAddToCart({
      id: addon.id,
      name: addon.name,
      type: "addon",
      quantity: 1,
      pricePerUnit: addon.price,
    });
  };

  return (
    <section id="catalog" className="py-6 sm:py-16 bg-[#FDFBF7] border-b border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif text-[#2D2A26] tracking-tight leading-tight">
            Tote Packages
          </h2>

          {/* Interactive Quiz Trigger Banner */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#E5DCCF] border border-[#EBE3D5] text-[#2D2A26] text-[10px] sm:text-xs font-bold transition shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#5A6B5D]" />
              <span>Unsure? Take our 1-minute Tote Calculator Quiz</span>
            </button>
          </div>
        </div>

        {/* Primary Packages Grid - 3 columns side by side on mobile */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-8 items-stretch">
          {TOTE_PACKAGES.map((pkg) => {
            const added = isItemInCart(pkg.id);

            return (
              <div
                key={pkg.id}
                className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
                  pkg.popular
                    ? "bg-[#F8FAF8] border-2 border-[#5A6B5D] text-[#2D2A26] shadow-sm"
                    : "bg-[#FDFBF7] border border-[#EBE3D5] text-[#2D2A26] shadow-xs hover:border-[#5A6B5D]"
                }`}
              >
                {/* Popular Ribbon */}
                {pkg.popular && (
                  <div className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 bg-[#5A6B5D] text-white font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 sm:px-3 sm:py-0.5 rounded-full shadow-xs flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                    <span>Popular</span>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-4">
                  {/* Package Title & Home Size */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs sm:text-xl font-bold text-[#2D2A26] leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-[9px] sm:text-xs font-semibold text-[#A08E79] leading-tight">
                      {pkg.homeSize}
                      {(pkg.id === "pkg-studio" || pkg.id === "pkg-2-3bed") && (
                        <span className="block">&nbsp;</span>
                      )}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1">
                    <span className="text-base sm:text-4xl font-serif text-[#5A6B5D]">
                      ${pkg.basePrice2Weeks}
                    </span>
                    <span className="text-[9px] sm:text-xs text-[#5E5449] leading-tight">
                      / 2-wk rental
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-xs leading-tight sm:leading-relaxed text-[#5E5449] hidden sm:block">
                    {pkg.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-1 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-[#EBE3D5]">
                    <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#2D2A26] hidden sm:block">
                      Package Includes:
                    </div>
                    <ul className="space-y-1 sm:space-y-2 text-[9px] sm:text-xs">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1 sm:gap-2">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-[#5A6B5D]" />
                          <span className={i === 0 ? "font-bold text-[#2D2A26] leading-tight" : "text-[#5E5449] leading-tight"}>
                            {inc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Add to Cart / Select Button */}
                <div className="pt-2 sm:pt-6 mt-2 sm:mt-4 border-t border-[#EBE3D5]">
                  <button
                    type="button"
                    onClick={() => handleAddPackage(pkg)}
                    className={`w-full py-1.5 sm:py-3 px-1 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                      added
                        ? "bg-[#5A6B5D] text-white"
                        : pkg.popular
                        ? "bg-[#5A6B5D] hover:bg-[#4A594D] text-white shadow-xs"
                        : "bg-[#2D2A26] hover:bg-[#3E362E] text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span>Select</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom A-La-Carte Quantity Selector Box */}
        <div className="bg-[#F5F2ED] rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-[#EBE3D5] w-full space-y-3 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase text-[#A08E79] tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#5A6B5D]" /> A-La-Carte Rental
              </span>
              <h3 className="text-base sm:text-xl font-serif text-[#2D2A26]">
                Need a Custom Number of Totes?
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5E5449]">
                Choose exact tote count ($4/tote for 2 weeks).
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-lg sm:text-2xl font-serif text-[#5A6B5D]">
                ${customToteCount * BASE_TOTE_RATE_2WEEKS}
              </span>
              <span className="text-[10px] sm:text-xs text-[#5E5449] block">
                ({customToteCount} totes @ $4/ea)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-xl border border-[#EBE3D5]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-semibold text-[#5E5449]">Totes:</span>
              <button
                type="button"
                onClick={() => setCustomToteCount((c) => Math.max(1, c - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#2D2A26] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#EBE3D5]"
              >
                -
              </button>
              <input
                type="number"
                value={customToteCount}
                onChange={(e) => setCustomToteCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 sm:w-16 text-center py-0.5 sm:py-1 font-bold text-[#2D2A26] border border-[#EBE3D5] rounded-lg text-xs sm:text-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setCustomToteCount((c) => c + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#2D2A26] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#EBE3D5]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddCustomTotes}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#5A6B5D] hover:bg-[#4A594D] text-white text-[10px] sm:text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add {customToteCount} Totes</span>
            </button>
          </div>
        </div>

        {/* Moving Add-ons Section - 2 cols on mobile */}
        <div className="space-y-4 sm:space-y-8 pt-4 sm:pt-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-2xl font-serif text-[#2D2A26]">
              Helpful Add-Ons
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {ADD_ON_ITEMS.map((addon) => {
              const added = isItemInCart(addon.id);
              const isKit = addon.category === "kits" || addon.id.includes("kit");

              return (
                <div
                  key={addon.id}
                  className="bg-[#F5F2ED] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#EBE3D5] flex flex-col justify-between hover:border-[#5A6B5D]/60 transition space-y-2 sm:space-y-4"
                >
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#E5DCCF]">
                        {getAddOnIcon(addon.iconName)}
                      </div>
                      <span className="font-serif text-[#5A6B5D] text-sm sm:text-lg font-bold">
                        ${addon.price} <span className="text-[9px] sm:text-[10px] text-[#5E5449] font-sans font-normal">/{addon.unit}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-[#2D2A26] text-xs sm:text-sm leading-snug">
                      {addon.name}
                    </h4>

                    {isKit && addon.kitItems ? (
                      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#5E5449] text-[10px] sm:text-xs pt-0.5">
                        {addon.kitItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.2 h-1.2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#5A6B5D] shrink-0" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : isKit ? (
                      <p className="text-[#5E5449] text-[10px] sm:text-xs leading-tight sm:leading-relaxed">
                        {addon.description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddAddOn(addon)}
                    className={`w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 ${
                      added
                        ? "bg-[#5A6B5D] text-white"
                        : "bg-white hover:bg-[#FDFBF7] text-[#2D2A26] border border-[#EBE3D5]"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5A6B5D]" />
                        <span>Add {addon.shortName || addon.name}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* View Cart / Floating Reservation Callout */}
        <div className="bg-[#2D2A26] text-[#EBE3D5] rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm text-center sm:text-left">
          <div className="space-y-0.5 sm:space-y-1">
            <h4 className="font-serif text-white text-sm sm:text-lg flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#A08E79]" />
              <span>Ready to lock in your reservation?</span>
            </h4>
            <p className="text-[10px] sm:text-xs text-[#A08E79]">
              Your cart has {cart.length} item{cart.length === 1 ? "" : "s"}. Pick your delivery date in checkout!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCheckout}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#A08E79] hover:bg-[#8C7B68] text-white font-bold text-xs sm:text-sm transition"
          >
            Review Cart &amp; Reserve Date
          </button>
        </div>

      </div>
    </section>
  );
};
