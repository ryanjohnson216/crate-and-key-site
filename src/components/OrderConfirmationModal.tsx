import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { ReservationDetails, BrandTheme } from "../types";
import { CheckCircle2, Calendar, MapPin, Package, Download, X, Phone, Mail, FileText } from "lucide-react";

interface OrderConfirmationModalProps {
  reservation: ReservationDetails | null;
  onClose: () => void;
  theme: BrandTheme;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  reservation,
  onClose,
  theme,
}) => {
  if (!reservation) return null;

  const isWarm = theme === "warm-friendly";

  useEffect(() => {
    // Fire festive confetti animation upon opening confirmation!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D2A26]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#EBE3D5] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A08E79] hover:text-[#2D2A26] rounded-xl hover:bg-[#F5F2ED] transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#F8FAF8] text-[#5A6B5D] mx-auto flex items-center justify-center border border-[#5A6B5D]/30 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A6B5D] bg-[#F8FAF8] px-3 py-1 rounded-full border border-[#5A6B5D]/30">
              Reservation Request Received
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#2D2A26] pt-1">
              We Received Your Request!
            </h3>
            <p className="text-xs sm:text-sm text-[#5E5449]">
              Request Reference Code: <strong className="text-[#2D2A26] font-mono text-base">{reservation.confirmationCode}</strong>
            </p>
          </div>
        </div>

        {/* Schedule & Delivery Box */}
        <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#EBE3D5] space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#EBE3D5]">
              <Calendar className="w-5 h-5 text-[#5A6B5D] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#2D2A26]">Drop-Off Delivery Date</div>
                <div className="text-[#5A6B5D] font-bold text-sm mt-0.5">{reservation.deliveryDate}</div>
                <div className="text-[10px] text-[#A08E79] mt-0.5">Totes dropped off stacked &amp; sanitized</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#EBE3D5]">
              <Calendar className="w-5 h-5 text-[#5A6B5D] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#2D2A26]">Return Pickup Date</div>
                <div className="text-[#5A6B5D] font-bold text-sm mt-0.5">{reservation.pickupDate}</div>
                <div className="text-[10px] text-[#A08E79] mt-0.5">We collect empty stacked totes</div>
              </div>
            </div>

          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#EBE3D5] text-xs">
            <MapPin className="w-5 h-5 text-[#5A6B5D] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2D2A26]">Delivery Address</div>
              <div className="text-[#5E5449] font-medium">{reservation.deliveryAddress}, {reservation.city}, IL {reservation.zipCode}</div>
              {reservation.dropoffNotes && (
                <div className="text-[11px] text-[#5A6B5D] font-medium mt-1">
                  Notes: "{reservation.dropoffNotes}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#2D2A26] text-sm flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#5A6B5D]" />
            <span>Items Reserved</span>
          </h4>

          <div className="bg-[#F5F2ED] rounded-xl p-4 border border-[#EBE3D5] space-y-2 text-xs">
            {reservation.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-[#EBE3D5] pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-[#2D2A26]">{item.name}</span>
                  {item.details && item.type !== "addon" && <span className="text-[11px] text-[#A08E79] block">{item.details}</span>}
                </div>
                <span className="font-bold text-[#2D2A26]">
                  ${(item.pricePerUnit * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-[#EBE3D5] flex justify-between font-bold text-[#2D2A26] text-sm">
              <span>Estimated Total:</span>
              <span className="text-[#5A6B5D] font-serif text-base">${reservation.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps Info Box */}
        <div className="bg-[#F5F2ED] rounded-xl p-4 border border-[#EBE3D5] text-xs space-y-2">
          <h5 className="font-bold text-[#2D2A26] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#5A6B5D]" />
            <span>What happens next?</span>
          </h5>
          <ul className="list-disc list-inside text-[#5E5449] space-y-1 text-[11px] leading-relaxed">
            <li>A summary of your reservation request was emailed to <strong>{reservation.email}</strong>.</li>
            <li>Our team will check tote inventory for <strong>{reservation.deliveryDate}</strong> and email your confirmation with invoice &amp; payment details within 2 hours.</li>
            <li>No charge or commitment until you review and approve the payment details!</li>
            <li>Questions? Call or text us anytime at <a href="tel:3098865202" className="font-bold hover:underline">(309) 886-5202</a>.</li>
          </ul>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3.5 rounded-full bg-[#E5DCCF] hover:bg-[#EBE3D5] text-[#2D2A26] font-bold text-xs transition flex items-center justify-center gap-2 border border-[#EBE3D5]"
          >
            <Download className="w-4 h-4" />
            <span>Print Order Summary</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-[#5A6B5D] hover:bg-[#4A594D] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Done &amp; Back to Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
