import React from "react";
import { BrandTheme } from "../types";
import { BrandLogo } from "./BrandLogo";
import { ArrowLeft } from "lucide-react";

interface TermsAndConditionsPageProps {
  theme: BrandTheme;
  onNavigateHome: () => void;
  onOpenCheckout?: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({
  theme,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E362E] font-sans antialiased pb-2">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE3D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm font-semibold text-[#5E5449] hover:text-[#2D2A26] transition-colors w-28"
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

          <div className="w-28" />
        </div>
      </header>

      {/* Hero Banner Header */}
      <div className="bg-[#2D2A26] text-[#EBE3D5] py-5 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-[#3E362E]">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight whitespace-nowrap text-center">
            Rental Terms &amp; Conditions
          </h1>
        </div>
      </div>

      {/* Main Terms Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="bg-white rounded-2xl px-6 sm:px-10 py-3 sm:py-4 shadow-xs border border-[#EBE3D5] space-y-6">
          
          {/* Introductory Notice */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F5EE] border border-[#EBE3D5] text-sm text-[#5E5449] font-medium leading-relaxed">
            By renting totes from Crate &amp; Key, the Customer agrees to the following terms:
          </div>

          {/* Numbered Sections List */}
          <div className="space-y-8 divide-y divide-[#F0EAEE]">
            
            {/* 1. Assumption of Liability */}
            <div className="pt-2 first:pt-0 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">1</span>
                <span>Assumption of Liability</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Customer accepts full responsibility for the totes for the duration of the rental period, including any loss, theft, damage, or misuse that occurs while the totes are in Customer's possession or control.
              </p>
            </div>

            {/* 2. Rental Period & Return */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">2</span>
                <span>Rental Period &amp; Return</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Totes must be returned to Crate &amp; Key or made available for scheduled pickup by the end of the agreed rental period. Customer is responsible for ensuring totes are accessible at the agreed pickup location and time.
              </p>
            </div>

            {/* 3. Late Return Fees */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">3</span>
                <span>Late Return Fees</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Totes not returned or made available for pickup by the end of the rental period will incur a late fee of $3/day per tote, or $20/week per tote, whichever applies, charged automatically to the card on file until the totes are returned or deemed lost (see Section 6).
              </p>
            </div>

            {/* 4. Condition at Return */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">4</span>
                <span>Condition at Return</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Customer agrees to empty all totes of contents and ensure they are reasonably clean (free of food residue, liquids, or other heavy soiling) before return or pickup.
              </p>
            </div>

            {/* 5. Damage, Loss, and Soiling Charges */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">5</span>
                <span>Damage, Loss, and Soiling Charges</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                A charge of $15 per tote will apply for any tote that is lost, damaged (including cracked, broken, or missing lids), or returned heavily soiled such that it requires special cleaning. This charge will be billed to the card on file.
              </p>
            </div>

            {/* 6. Unreturned Totes */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">6</span>
                <span>Unreturned Totes</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Totes not returned within 14 days after the rental period ends will be considered lost, and Customer will be charged the full replacement cost of $15 per tote in addition to any accrued late fees.
              </p>
            </div>

            {/* 7. Authorization to Charge Card on File */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">7</span>
                <span>Authorization to Charge Card on File</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                By accepting these terms, Customer authorizes Crate &amp; Key to charge the payment method on file for any late fees, damage charges, soiling charges, or replacement costs described above, without requiring additional approval at the time of charge.
              </p>
            </div>

            {/* 8. Appropriate Use */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">8</span>
                <span>Appropriate Use</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Totes are intended for standard household goods only. Customer agrees not to use totes to store or transport hazardous materials, perishable food left for extended periods, liquids likely to leak, or items exceeding a safe weight for one person to lift (approximately 50 lbs per tote).
              </p>
            </div>

            {/* 9. Inspection */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">9</span>
                <span>Inspection</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Totes are inspected and provided in clean, functional condition at delivery. Customer should report any pre-existing damage within 24 hours of delivery; absent such notice, totes are presumed to have been delivered in good condition.
              </p>
            </div>

            {/* 10. Limitation of Liability */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">10</span>
                <span>Limitation of Liability</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Crate &amp; Key is not responsible for damage to Customer's property, belongings, or premises arising from Customer's use of the totes. Customer assumes all risk associated with packing, stacking, transporting, and storing loaded totes.
              </p>
            </div>

            {/* 11. Ownership */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">11</span>
                <span>Ownership</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                All totes remain the property of Crate &amp; Key at all times. Rental does not transfer ownership under any circumstance.
              </p>
            </div>

            {/* 12. Access for Pickup */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">12</span>
                <span>Access for Pickup</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Customer agrees to provide reasonable access to the totes at the agreed pickup location and time. Missed pickups due to inaccessibility may be treated as a late return and subject to the fees in Section 3.
              </p>
            </div>

            {/* 13. Agreement */}
            <div className="pt-6 space-y-2">
              <h2 className="text-base font-bold text-[#2D2A26] flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#EBE3D5] text-[#3E362E]">13</span>
                <span>Agreement</span>
              </h2>
              <p className="text-sm text-[#5E5449] leading-relaxed pl-7">
                Completing payment or checkout constitutes Customer's acceptance of these Terms &amp; Conditions in full.
              </p>
            </div>

          </div>

          {/* Footer Statement */}
          <div className="pt-3 border-t border-[#EBE3D5] flex items-center justify-end text-xs text-[#8C7A6B]">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-lg bg-[#EBE3D5] hover:bg-[#D9CEBA] font-semibold text-[#2D2A26] transition"
            >
              Return to Home Page
            </button>
          </div>

        </div>
      </main>

    </div>
  );
};
