import React from "react";
import { BrandTheme } from "../types";
import { BrandLogo } from "./BrandLogo";
import { ArrowLeft, Phone, Mail, Facebook, Instagram, ShoppingBag } from "lucide-react";

interface AboutPageProps {
  theme: BrandTheme;
  onNavigateHome: () => void;
  onOpenCheckout: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  theme,
  onNavigateHome,
  onOpenCheckout,
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E362E] font-sans antialiased pb-16">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EBE3D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5E5449] hover:text-[#2D2A26] transition-colors cursor-pointer"
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

          <button
            type="button"
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#A08E79] hover:bg-[#8C7B68] text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reserve Totes</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        
        {/* Profile & Story Section Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBE3D5] p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">
          
          {/* Photo Column - stretches to full height of text & connect block */}
          <div className="md:col-span-5 flex flex-col h-full min-h-[320px]">
            <img
              src="https://about-ryan-johnson.carrd.co/assets/images/image01.jpg?v=0bfaa629"
              alt="Ryan Johnson & Family"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl border border-[#EBE3D5] shadow-xs"
            />
          </div>

          {/* Right Text Story & Connect Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Main Header & Body Text */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] tracking-tight">
                Hi, I'm Ryan.
              </h1>

              <div className="space-y-4 text-sm sm:text-base text-[#5E5449] leading-relaxed">
                <p>
                  I'm the guy behind Crate &amp; Key providing reusable moving crates that alleviate the chaos of moving day. No more scrounging for cardboard boxes that collapse mid-move and nothing extra headed to the landfill afterward.
                </p>

                <p>
                  I started Crate &amp; Key because I care about making my neighbors' lives a little easier during one of the most stressful weeks they'll have all year. And because building something real, useful, and close to home is exactly the kind of work I want to be doing.
                </p>

                <p>
                  But the biggest reason is for my family. It's letting my wife hit pause on her RN career to stay home to raise our three boys while building something that gives back to the community we live in.
                </p>
              </div>
            </div>

            {/* Let's Connect Section directly inside main card */}
            <div className="pt-6 border-t border-[#EBE3D5] space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2A26] tracking-tight">
                LET'S CONNECT
              </h2>

              <div className="flex items-center gap-3">
                {/* Email */}
                <a
                  href="mailto:hello@crateandkey.com"
                  title="Email Us: hello@crateandkey.com"
                  aria-label="Email Us"
                  className="w-11 h-11 rounded-full bg-[#2D2A26] hover:bg-[#3E362E] text-white flex items-center justify-center transition shadow-xs hover:scale-105"
                >
                  <Mail className="w-5 h-5 text-[#EBE3D5]" />
                </a>

                {/* Call or Text */}
                <a
                  href="tel:3098865202"
                  title="Call or Text: (309) 886-5202"
                  aria-label="Call or Text"
                  className="w-11 h-11 rounded-full bg-[#2D2A26] hover:bg-[#3E362E] text-white flex items-center justify-center transition shadow-xs hover:scale-105"
                >
                  <Phone className="w-5 h-5 text-[#EBE3D5]" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/crateandkey"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook: /crateandkey"
                  aria-label="Facebook Page"
                  className="w-11 h-11 rounded-full bg-[#2D2A26] hover:bg-[#1877F2] text-white flex items-center justify-center transition shadow-xs hover:scale-105"
                >
                  <Facebook className="w-5 h-5 text-[#EBE3D5]" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/crate-and-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram: @crate-and-key"
                  aria-label="Instagram Profile"
                  className="w-11 h-11 rounded-full bg-[#2D2A26] hover:bg-[#E4405F] text-white flex items-center justify-center transition shadow-xs hover:scale-105"
                >
                  <Instagram className="w-5 h-5 text-[#EBE3D5]" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
