import React, { useState, useEffect, useRef } from "react";
import { Camera, CheckCircle2, Maximize2, X, ShieldCheck, Tag, Layers, MoveRight, Upload, Image as ImageIcon } from "lucide-react";

interface RealProductPhotoCardProps {
  onOpenCheckout?: () => void;
  compact?: boolean;
}

export const RealProductPhotoCard: React.FC<RealProductPhotoCardProps> = ({
  onOpenCheckout,
  compact = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"totes" | "dolly" | "labels">("totes");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user has uploaded a custom photo in browser storage
    const savedPhoto = localStorage.getItem("custom_totes_photo");
    if (savedPhoto) {
      setPhotoUrl(savedPhoto);
    } else {
      setPhotoUrl("/totes-fleet.jpg");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotoUrl(result);
          localStorage.setItem("custom_totes_photo", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Main Photo Card */}
      <div className="bg-white rounded-2xl border border-[#EBE3D5] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md group">
        
        {/* Photo Container with Natural Aspect Ratio */}
        <div className="relative bg-[#FAF8F5] p-3 sm:p-4 flex flex-col items-center justify-center">
          
          {/* Subtle Top Utility Bar */}
          <div className="w-full mb-3 flex items-center justify-between text-xs px-1">
            <div className="font-serif font-bold text-[#2D2A26] text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#5A6B5D]" />
              <span>Rental Equipment Setup</span>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-[11px] font-semibold text-[#5A6B5D] hover:text-[#3A4B3D] bg-white px-2.5 py-1 rounded-lg border border-[#EBE3D5] flex items-center gap-1.5 transition shadow-2xs hover:bg-[#F5F2ED]"
            >
              <Upload className="w-3 h-3 text-[#A08E79]" />
              <span>{photoUrl && photoUrl.startsWith("data:") ? "Change Photo" : "Upload Photo"}</span>
            </button>
          </div>

          {/* Natural Image Canvas Box */}
          <div 
            className="w-full relative rounded-xl overflow-hidden border border-[#EBE3D5] shadow-xs bg-[#F5F2ED] flex items-center justify-center cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Tote Rental Equipment Stack on Dolly"
                className="w-full h-auto object-contain max-h-[460px] rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}

            {/* Fallback & File Upload Callout */}
            <div className={`${photoUrl ? 'hidden' : 'flex'} flex-col items-center justify-center p-8 text-center space-y-3 bg-white w-full h-full min-h-[220px]`}>
              <div className="w-12 h-12 rounded-full bg-[#A08E79]/10 text-[#A08E79] flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs">
                <div className="font-bold text-[#2D2A26] text-sm">Add Your Equipment Photo</div>
                <div className="text-xs text-[#5E5449] leading-relaxed">
                  Click to select a photo from your computer or phone. It will adjust to your photo's exact proportions.
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-[#A08E79] hover:bg-[#8C7B68] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <Upload className="w-4 h-4" />
                <span>Select Photo File</span>
              </button>
            </div>

            {/* Subtle Zoom Badge */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#EBE3D5] text-[#2D2A26] text-xs font-semibold flex items-center gap-1.5 shadow-xs group-hover:bg-[#5A6B5D] group-hover:text-white transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Equipment Specs</span>
            </div>
          </div>
        </div>

        {/* Specs Footer */}
        <div className="p-4 bg-white space-y-3 border-t border-[#EBE3D5]">
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-[#5E5449]">
            <div className="bg-[#F5F2ED] p-2 rounded-xl border border-[#EBE3D5]">
              <div className="font-bold text-[#2D2A26] text-xs">27 Gallons</div>
              <div>Per Tote</div>
            </div>
            <div className="bg-[#F5F2ED] p-2 rounded-xl border border-[#EBE3D5]">
              <div className="font-bold text-[#2D2A26] text-xs">Snap Lids</div>
              <div>Yellow Lock</div>
            </div>
            <div className="bg-[#F5F2ED] p-2 rounded-xl border border-[#EBE3D5]">
              <div className="font-bold text-[#2D2A26] text-xs">Rolling Dolly</div>
              <div>Included</div>
            </div>
          </div>

          {onOpenCheckout && (
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full py-2.5 rounded-xl bg-[#A08E79] hover:bg-[#8C7B68] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Reserve Equipment Now</span>
              <MoveRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Equipment Detailed Spec Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#EBE3D5] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#F5F2ED] p-5 border-b border-[#EBE3D5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A08E79]">
                  Equipment Details
                </span>
                <h3 className="text-xl font-serif text-[#2D2A26]">
                  Standard Rental Tote &amp; Dolly Specs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#E5DCCF] text-[#5E5449] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#EBE3D5] bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("totes")}
                className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
                  activeTab === "totes"
                    ? "border-[#5A6B5D] text-[#5A6B5D]"
                    : "border-transparent text-[#8C7A6B] hover:text-[#2D2A26]"
                }`}
              >
                27-Gal Heavy Duty Tote
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dolly")}
                className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
                  activeTab === "dolly"
                    ? "border-[#5A6B5D] text-[#5A6B5D]"
                    : "border-transparent text-[#8C7A6B] hover:text-[#2D2A26]"
                }`}
              >
                Rolling Dolly Base
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("labels")}
                className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
                  activeTab === "labels"
                    ? "border-[#5A6B5D] text-[#5A6B5D]"
                    : "border-transparent text-[#8C7A6B] hover:text-[#2D2A26]"
                }`}
              >
                Room Labels &amp; Seals
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              {activeTab === "totes" && (
                <div className="space-y-4 text-xs text-[#5E5449]">
                  <div className="bg-white p-4 rounded-2xl border border-[#EBE3D5] space-y-2">
                    <div className="font-bold text-[#2D2A26] text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Heavy-Duty Industrial Polypropylene</span>
                    </div>
                    <p className="leading-relaxed">
                      Commercial-grade 27-gallon black totes engineered with reinforced structural ribbing. Guaranteed non-flexing walls keep contents safe during transit.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-[#F5F2ED] p-3 rounded-xl border border-[#EBE3D5]">
                      <div className="text-[#8C7A6B] text-[10px]">Dimensions</div>
                      <div className="font-bold text-[#2D2A26]">30.5" L x 20.2" W x 14.3" H</div>
                    </div>
                    <div className="bg-[#F5F2ED] p-3 rounded-xl border border-[#EBE3D5]">
                      <div className="text-[#8C7A6B] text-[10px]">Weight Limit</div>
                      <div className="font-bold text-[#2D2A26]">Up to 75 lbs / tote</div>
                    </div>
                    <div className="bg-[#F5F2ED] p-3 rounded-xl border border-[#EBE3D5]">
                      <div className="text-[#8C7A6B] text-[10px]">Lid Design</div>
                      <div className="font-bold text-[#2D2A26]">Yellow Interlocking Snap Lock</div>
                    </div>
                    <div className="bg-[#F5F2ED] p-3 rounded-xl border border-[#EBE3D5]">
                      <div className="text-[#8C7A6B] text-[10px]">Stack Limit</div>
                      <div className="font-bold text-[#2D2A26]">Stackable up to 4 High</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "dolly" && (
                <div className="space-y-4 text-xs text-[#5E5449]">
                  <div className="bg-white p-4 rounded-2xl border border-[#EBE3D5] space-y-2">
                    <div className="font-bold text-[#2D2A26] text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Smooth-Rolling Dolly &amp; Bungee System</span>
                    </div>
                    <p className="leading-relaxed">
                      Custom-fitted four-wheel dolly with non-marking rubber casters that glide smoothly over hardwood, carpet, and doorways.
                    </p>
                  </div>

                  <ul className="space-y-2 bg-[#F5F2ED] p-4 rounded-xl border border-[#EBE3D5]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Telescoping handle adjusts for comfortable pulling posture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Heavy bungee cord included to secure stacks up to 4 high</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Saves your back from heavy lifting during moving day</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "labels" && (
                <div className="space-y-4 text-xs text-[#5E5449]">
                  <div className="bg-white p-4 rounded-2xl border border-[#EBE3D5] space-y-2">
                    <div className="font-bold text-[#2D2A26] text-sm flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#5A6B5D]" />
                      <span>Color-Coded Pre-Printed Room Labels</span>
                    </div>
                    <p className="leading-relaxed">
                      No messy tape or permanent markers needed. Each package includes reusable plastic insert tags for "GARAGE", "LIVING ROOM", "KITCHEN", "BEDROOM", etc.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#5A6B5D]/10 border border-[#5A6B5D]/30 text-[#2D2A26] space-y-1">
                    <div className="font-bold text-[#5A6B5D]">Security Zip Ties Included</div>
                    <div className="text-[11px] text-[#5E5449]">
                      Lock lids tightly during transit with zip-tie eyelets on each tote corner.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#F5F2ED] border-t border-[#EBE3D5] flex items-center justify-between">
              <span className="text-xs text-[#8C7A6B]">Sanitized After Every Rental</span>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onOpenCheckout) onOpenCheckout();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#5A6B5D] hover:bg-[#4A594D] text-white font-bold text-xs transition"
              >
                Reserve This Setup
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
