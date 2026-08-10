import React, { useState } from "react";
import { BrandTheme, CartItem } from "../types";
import { TOTE_PACKAGES, BASE_TOTE_RATE_2WEEKS } from "../data/catalog";
import { X, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Plus, Calculator } from "lucide-react";

interface ToteQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: BrandTheme;
  onAddToCart: (item: CartItem) => void;
  onOpenCheckout: () => void;
}

export const ToteQuizModal: React.FC<ToteQuizModalProps> = ({
  isOpen,
  onClose,
  theme,
  onAddToCart,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  const isWarm = theme === "warm-friendly";

  const [step, setStep] = useState(1);
  const [homeSize, setHomeSize] = useState("2bed"); // 'studio', '2bed', '4bed'
  const [packingStyle, setPackingStyle] = useState("average"); // 'minimalist', 'average', 'heavy'
  const [specialItems, setSpecialItems] = useState<string[]>([]); // 'closet', 'books', 'garage'

  const toggleSpecial = (id: string) => {
    setSpecialItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculate recommended package or tote count
  const getRecommendation = () => {
    let baseTotes = 25;
    if (homeSize === "studio") baseTotes = 25;
    if (homeSize === "2bed") baseTotes = 45;
    if (homeSize === "4bed") baseTotes = 70;

    // Packing multiplier
    if (packingStyle === "minimalist") baseTotes = Math.round(baseTotes * 0.85);
    if (packingStyle === "heavy") baseTotes = Math.round(baseTotes * 1.2);

    // Special items boost
    if (specialItems.includes("closet")) baseTotes += 5;
    if (specialItems.includes("books")) baseTotes += 5;
    if (specialItems.includes("garage")) baseTotes += 10;

    // Match closest package
    if (baseTotes <= 30) {
      return {
        pkg: TOTE_PACKAGES[0],
        adjustedTotes: Math.max(25, baseTotes),
        reason: "Ideal for studios/1-bedrooms and minimalist movers.",
      };
    } else if (baseTotes <= 55) {
      return {
        pkg: TOTE_PACKAGES[1],
        adjustedTotes: baseTotes,
        reason: "Matches 2-3 bedroom homes with standard wardrobe and kitchen items.",
      };
    } else {
      return {
        pkg: TOTE_PACKAGES[2],
        adjustedTotes: baseTotes,
        reason: "Designed for spacious homes with lots of closets, basement, or garage gear.",
      };
    }
  };

  const rec = getRecommendation();

  const handleAddRecommended = () => {
    onAddToCart({
      id: rec.pkg.id,
      name: rec.pkg.name,
      type: "package",
      quantity: 1,
      pricePerUnit: rec.pkg.basePrice2Weeks,
      toteCount: rec.pkg.toteCount,
      details: rec.pkg.dolliesIncluded > 0 
        ? `Recommended Quiz Bundle: ${rec.pkg.toteCount} Totes + ${rec.pkg.dolliesIncluded} ${rec.pkg.dolliesIncluded === 1 ? "Dolly" : "Dollies"}`
        : `Recommended Quiz Bundle: ${rec.pkg.toteCount} Totes (2-week rental)`,
    });
    onClose();
    onOpenCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2A26]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#EBE3D5] shadow-xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A08E79] hover:text-[#2D2A26] rounded-lg hover:bg-[#F5F2ED] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5DCCF] text-[#5A6B5D] text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-[#5A6B5D]" />
            <span>1-Minute Tote Size Calculator</span>
          </div>
          <h3 className="text-2xl font-serif text-[#2D2A26]">
            How Many Totes Do You Need?
          </h3>
          <p className="text-xs text-[#5E5449]">
            Answer 3 simple questions to get your custom tote recommendation.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-[#5A6B5D]" : "bg-[#EBE3D5]"
              }`}
            />
          ))}
        </div>

        {/* Question 1: Home Size */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#2D2A26] text-sm">
              1. What size is your current home or apartment?
            </h4>

            <div className="space-y-2.5">
              {[
                { id: "studio", label: "Studio / 1 Bedroom Apartment", desc: "Approx 400 - 800 sq ft" },
                { id: "2bed", label: "2 - 3 Bedroom House or Condo", desc: "Approx 900 - 1,800 sq ft" },
                { id: "4bed", label: "4+ Bedroom Large Home", desc: "Approx 2,000+ sq ft with basement/garage" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setHomeSize(opt.id)}
                  className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between ${
                    homeSize === opt.id
                      ? "border-[#5A6B5D] bg-[#F8FAF8] text-[#2D2A26] font-semibold"
                      : "border-[#EBE3D5] bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#5E5449]"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="text-xs text-[#A08E79]">{opt.desc}</div>
                  </div>
                  {homeSize === opt.id && <CheckCircle2 className="w-5 h-5 text-[#5A6B5D]" />}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-full bg-[#5A6B5D] hover:bg-[#4A594D] text-white font-bold text-sm transition flex items-center justify-center gap-2 mt-4"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Question 2: Packing Style */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#2D2A26] text-sm">
              2. How would you describe your packing density?
            </h4>

            <div className="space-y-2.5">
              {[
                { id: "minimalist", label: "Minimalist / Light Packer", desc: "Fewer possessions, empty closets, sparse decor." },
                { id: "average", label: "Average Packer", desc: "Standard furniture, normal closets, kitchenware." },
                { id: "heavy", label: "Heavy Packer / Collector", desc: "Full closets, lots of books, decor, or seasonal items." },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPackingStyle(opt.id)}
                  className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between ${
                    packingStyle === opt.id
                      ? "border-[#5A6B5D] bg-[#F8FAF8] text-[#2D2A26] font-semibold"
                      : "border-[#EBE3D5] bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#5E5449]"
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{opt.label}</div>
                    <div className="text-xs text-[#A08E79]">{opt.desc}</div>
                  </div>
                  {packingStyle === opt.id && <CheckCircle2 className="w-5 h-5 text-[#5A6B5D]" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-full bg-[#E5DCCF] text-[#2D2A26] font-bold text-sm transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-full bg-[#5A6B5D] hover:bg-[#4A594D] text-white font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Question 3: Bulky / Special Storage */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-bold text-[#2D2A26] text-sm">
              3. Any special or bulky items to pack? (Select all that apply)
            </h4>

            <div className="space-y-2.5">
              {[
                { id: "closet", label: "Full Wardrobes / Heavy Coats", desc: "Lots of hanging clothes, shoes, or winter wear" },
                { id: "books", label: "Heavy Books & Office Gear", desc: "Totes are crushproof and ideal for heavy books" },
                { id: "garage", label: "Garage, Tools, or Outdoor Gear", desc: "Power tools, sports gear, camping equipment" },
              ].map((opt) => {
                const selected = specialItems.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleSpecial(opt.id)}
                    className={`w-full p-4 rounded-xl text-left border transition flex items-center justify-between ${
                      selected
                        ? "border-[#5A6B5D] bg-[#F8FAF8] text-[#2D2A26] font-semibold"
                        : "border-[#EBE3D5] bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#5E5449]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{opt.label}</div>
                      <div className="text-xs text-[#A08E79]">{opt.desc}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        selected ? "bg-[#5A6B5D] border-[#5A6B5D] text-white" : "border-[#EBE3D5]"
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-full bg-[#E5DCCF] text-[#2D2A26] font-bold text-sm transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 py-3 rounded-full bg-[#A08E79] hover:bg-[#8C7B68] text-white font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Calculate Recommendation</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result Recommendation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-[#F5F2ED] rounded-2xl p-6 border border-[#EBE3D5] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] bg-[#E5DCCF] px-2.5 py-1 rounded-full">
                  Recommended For You
                </span>
                <span className="text-2xl font-serif text-[#5A6B5D]">
                  ${rec.pkg.basePrice2Weeks}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-serif text-[#2D2A26]">
                  {rec.pkg.name}
                </h4>
                <p className="text-xs text-[#5E5449] mt-1">
                  {rec.reason}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EBE3D5] text-xs space-y-2">
                <div className="font-bold text-[#2D2A26] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5A6B5D]" />
                  <span>Includes {rec.pkg.toteCount} Heavy-Duty Totes{rec.pkg.dolliesIncluded > 0 ? ` + ${rec.pkg.dolliesIncluded} Wheeled ${rec.pkg.dolliesIncluded === 1 ? "Dolly" : "Dollies"}` : ""}</span>
                </div>
                <div className="text-[#5E5449]">
                  Default 2-week rental ($4/tote rate) with zip-ties, color-coded room labels, &amp; markers.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddRecommended}
                className="flex-1 py-3.5 rounded-full bg-[#5A6B5D] hover:bg-[#4A594D] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Recommended Bundle to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3.5 rounded-full bg-[#E5DCCF] text-[#2D2A26] font-bold text-xs transition"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
