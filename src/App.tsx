/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrandTheme, CartItem, ReservationDetails } from "./types";
import { TOTE_PACKAGES } from "./data/catalog";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { WhyReusableSection } from "./components/WhyReusableSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ProductCatalogSection } from "./components/ProductCatalogSection";
import { ContactSection } from "./components/ContactSection";
import { FaqPage } from "./components/FaqPage";
import { AboutPage } from "./components/AboutPage";
import { FooterSection } from "./components/FooterSection";
import { ToteQuizModal } from "./components/ToteQuizModal";
import { ReservationCheckoutModal } from "./components/ReservationCheckoutModal";
import { OrderConfirmationModal } from "./components/OrderConfirmationModal";
import { TermsAndConditionsPage } from "./components/TermsAndConditionsPage";
import { AdminSyncModal } from "./components/AdminSyncModal";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { initGA, trackPageView, trackEvent } from "./lib/analytics";

export default function App() {
  const [theme, setTheme] = useState<BrandTheme>("warm-friendly");

  // Campaign & Referral Source Detection + GA Initialization
  const [campaignBanner, setCampaignBanner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Google Analytics on load
    initGA();

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmCampaign = params.get("utm_campaign");
    const ref = params.get("ref");
    const promo = params.get("promo");

    if (
      utmSource === "postcard" ||
      ref === "postcard" ||
      promo === "postcard" ||
      utmCampaign?.includes("postcard") ||
      utmCampaign?.includes("pending")
    ) {
      const tag = "Postcard Campaign (Pending Home Sale)";
      sessionStorage.setItem("crate_key_campaign", tag);
      setCampaignBanner("📬 Welcome Homeowner! Postcard offer active — FREE local delivery & pickup included on all tote rentals!");
      
      // GA Event for postcard QR scan / campaign visit
      trackEvent("postcard_landing", {
        campaign_source: "postcard",
        utm_campaign: utmCampaign || "pending_home_sale",
      });
    } else if (utmSource || ref || promo) {
      const tag = `Campaign: ${utmSource || ref || promo}${utmCampaign ? ` (${utmCampaign})` : ""}`;
      sessionStorage.setItem("crate_key_campaign", tag);
      setCampaignBanner(`✨ Welcome! Special offer active for visitors from ${utmSource || ref || promo}`);
      
      trackEvent("campaign_landing", {
        source: utmSource || ref || promo,
        campaign: utmCampaign,
      });
    }
  }, []);

  // View state: 'home' | 'terms' | 'faq' | 'about'
  const [currentView, setCurrentView] = useState<"home" | "terms" | "faq" | "about">(
    () => {
      if (typeof window !== "undefined") {
        if (window.location.hash === "#terms") return "terms";
        if (window.location.hash === "#faq") return "faq";
        if (window.location.hash === "#about") return "about";
      }
      return "home";
    }
  );

  const handleNavigate = (view: "home" | "terms" | "faq" | "about") => {
    setCurrentView(view);
    trackPageView(
      view === "terms"
        ? "/#terms"
        : view === "faq"
        ? "/#faq"
        : view === "about"
        ? "/#about"
        : "/",
      view === "terms"
        ? "Terms and Conditions"
        : view === "faq"
        ? "Frequently Asked Questions"
        : view === "about"
        ? "About Us - Crate & Key"
        : "Home - Crate & Key"
    );
    if (typeof window !== "undefined") {
      window.location.hash =
        view === "terms"
          ? "#terms"
          : view === "faq"
          ? "#faq"
          : view === "about"
          ? "#about"
          : "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#terms") {
        setCurrentView("terms");
      } else if (window.location.hash === "#faq") {
        setCurrentView("faq");
      } else if (window.location.hash === "#about") {
        setCurrentView("about");
      } else if (window.location.hash === "" || window.location.hash === "#home") {
        setCurrentView("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Cart state initialized with default popular 2-3 Bed package for immediate clarity
  const [cart, setCart] = useState<CartItem[]>(() => {
    const popularPkg = TOTE_PACKAGES[1]; // 2 - 3 Bedroom Package
    const dollyText = popularPkg.dolliesIncluded > 0 
      ? ` + ${popularPkg.dolliesIncluded} ${popularPkg.dolliesIncluded === 1 ? "Dolly" : "Dollies"}` 
      : "";
    return [
      {
        id: popularPkg.id,
        name: popularPkg.name,
        type: "package",
        quantity: 1,
        pricePerUnit: popularPkg.basePrice2Weeks,
        toteCount: popularPkg.toteCount,
        details: `${popularPkg.toteCount} Totes${dollyText} (2-week rental)`,
      },
    ];
  });

  // Modal Visibility
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminSyncOpen, setIsAdminSyncOpen] = useState(false);
  const [completedReservation, setCompletedReservation] = useState<ReservationDetails | null>(null);

  // Hidden Owner Portal Triggers (#admin hash, ?admin=true query, or Ctrl+Shift+A)
  useEffect(() => {
    const checkAdminTrigger = () => {
      if (window.location.hash === "#admin" || window.location.search.includes("admin=true")) {
        setIsAdminSyncOpen(true);
      }
    };

    checkAdminTrigger();
    window.addEventListener("hashchange", checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminSyncOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", checkAdminTrigger);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Add Item to Cart
  const handleAddToCart = (newItem: CartItem) => {
    trackEvent("add_to_cart", {
      currency: "USD",
      value: newItem.pricePerUnit * newItem.quantity,
      items: [{ item_id: newItem.id, item_name: newItem.name, quantity: newItem.quantity }],
    });

    setCart((prev) => {
      if (newItem.type === "package") {
        // Replace existing package, keep custom totes & add-ons
        const otherItems = prev.filter((i) => i.type !== "package");
        return [newItem, ...otherItems];
      }

      if (newItem.type === "custom") {
        // Replace existing custom tote selection, keep package & add-ons
        const otherItems = prev.filter((i) => i.type !== "custom");
        return [...otherItems, newItem];
      }

      // If add-on, check if exists
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) => (i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCompleteOrder = (reservation: ReservationDetails) => {
    setCompletedReservation(reservation);
    setIsCheckoutOpen(false);
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.pricePerUnit * i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E362E] font-sans antialiased selection:bg-[#E5DCCF] selection:text-[#3E362E]">
      
      {/* Wrapper for main page content, hidden during printing */}
      <div className="main-page-wrapper">
        {/* Postcard / Campaign Welcome Banner */}
        {campaignBanner && (
          <div className="bg-[#5A6B5D] text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 relative no-print shadow-xs border-b border-[#4A594D]">
            <span>{campaignBanner}</span>
            <button 
              type="button"
              onClick={() => setCampaignBanner(null)}
              className="ml-2 text-white/80 hover:text-white p-0.5 rounded-full hover:bg-white/20 transition"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {currentView === "terms" ? (
          <>
            <TermsAndConditionsPage
              theme={theme}
              onNavigateHome={() => handleNavigate("home")}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* Footer */}
            <FooterSection
              theme={theme}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onNavigateToTerms={() => handleNavigate("terms")}
              onNavigateToFaq={() => handleNavigate("faq")}
              onNavigateToAbout={() => handleNavigate("about")}
            />
          </>
        ) : currentView === "faq" ? (
          <>
            <FaqPage
              theme={theme}
              onNavigateHome={() => handleNavigate("home")}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />

            {/* Footer */}
            <FooterSection
              theme={theme}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onNavigateToTerms={() => handleNavigate("terms")}
              onNavigateToFaq={() => handleNavigate("faq")}
              onNavigateToAbout={() => handleNavigate("about")}
            />
          </>
        ) : currentView === "about" ? (
          <>
            <AboutPage
              theme={theme}
              onNavigateHome={() => handleNavigate("home")}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* Footer */}
            <FooterSection
              theme={theme}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onNavigateToTerms={() => handleNavigate("terms")}
              onNavigateToFaq={() => handleNavigate("faq")}
              onNavigateToAbout={() => handleNavigate("about")}
            />
          </>
        ) : (
          <>
            {/* Top Navigation */}
            <Navbar
              theme={theme}
              setTheme={setTheme}
              cart={cart}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onNavigateHome={() => handleNavigate("home")}
              onNavigateToFaq={() => handleNavigate("faq")}
              onNavigateToAbout={() => handleNavigate("about")}
            />

            {/* Main Page Sections in exact required order */}
            <main>
              {/* 1. Hero */}
              <HeroSection
                theme={theme}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onOpenQuiz={() => setIsQuizOpen(true)}
              />

              {/* 2. Why Reusable Totes */}
              <WhyReusableSection theme={theme} />

              {/* 3. How It Works */}
              <HowItWorksSection
                theme={theme}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />

              {/* 4. Product Catalog (Packages, Custom, Add-ons, Quiz trigger) */}
              <ProductCatalogSection
                theme={theme}
                cart={cart}
                onAddToCart={handleAddToCart}
                onOpenQuiz={() => setIsQuizOpen(true)}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />

              {/* 5. Contact Section */}
              <ContactSection theme={theme} />
            </main>

            {/* Footer */}
            <FooterSection
              theme={theme}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onNavigateToTerms={() => handleNavigate("terms")}
              onNavigateToFaq={() => handleNavigate("faq")}
              onNavigateToAbout={() => handleNavigate("about")}
            />
          </>
        )}

        {/* Sticky Bottom Quick Reservation Bar for Mobile & Quick Checkout Access */}
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl shadow-xl font-bold text-sm text-white flex items-center justify-between transition-transform active:scale-98 bg-[#5A6B5D]"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-100" />
              <span>Reserve Totes ({cart.length} item{cart.length === 1 ? "" : "s"})</span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold text-white">
              <span>${cartTotal}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <ToteQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        theme={theme}
        onAddToCart={handleAddToCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <ReservationCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        theme={theme}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCompleteOrder={handleCompleteOrder}
        onOpenTerms={() => handleNavigate("terms")}
      />

      <OrderConfirmationModal
        reservation={completedReservation}
        onClose={() => setCompletedReservation(null)}
        theme={theme}
      />

      <AdminSyncModal
        isOpen={isAdminSyncOpen}
        onClose={() => setIsAdminSyncOpen(false)}
      />

    </div>
  );
}
