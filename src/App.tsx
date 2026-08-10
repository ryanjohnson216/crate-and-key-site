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
import { FaqSection } from "./components/FaqSection";
import { FooterSection } from "./components/FooterSection";
import { ToteQuizModal } from "./components/ToteQuizModal";
import { ReservationCheckoutModal } from "./components/ReservationCheckoutModal";
import { OrderConfirmationModal } from "./components/OrderConfirmationModal";
import { TermsAndConditionsPage } from "./components/TermsAndConditionsPage";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<BrandTheme>("warm-friendly");

  // View state: 'home' | 'terms'
  const [currentView, setCurrentView] = useState<"home" | "terms">(() => {
    return typeof window !== "undefined" && window.location.hash === "#terms" ? "terms" : "home";
  });

  const handleNavigate = (view: "home" | "terms") => {
    setCurrentView(view);
    if (typeof window !== "undefined") {
      window.location.hash = view === "terms" ? "#terms" : "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#terms") {
        setCurrentView("terms");
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
  const [completedReservation, setCompletedReservation] = useState<ReservationDetails | null>(null);

  // Add Item to Cart
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // If it's a package, replace existing package or append
      if (newItem.type === "package" || newItem.type === "custom") {
        const nonPackages = prev.filter((i) => i.type !== "package" && i.type !== "custom");
        return [newItem, ...nonPackages];
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

            {/* 5. FAQ */}
            <FaqSection
              theme={theme}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />
          </main>

          {/* Footer */}
          <FooterSection
            theme={theme}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onNavigateToTerms={() => handleNavigate("terms")}
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

    </div>
  );
}
