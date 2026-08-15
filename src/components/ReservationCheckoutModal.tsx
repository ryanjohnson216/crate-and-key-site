import React, { useState, useEffect } from "react";
import { BrandTheme, CartItem, ReservationDetails } from "../types";
import { BASE_TOTE_RATE_2WEEKS, EXTRA_WEEK_RATE_PER_TOTE } from "../data/catalog";
import { X, Trash2, Plus, Minus, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, FileSpreadsheet, Mail } from "lucide-react";
import {
  initAuth,
  googleSignIn,
  googleLogout,
  appendReservationToGoogleSheet,
  sendReservationEmailNotification,
} from "../lib/googleWorkspace";
import { User } from "firebase/auth";
import { trackEvent } from "../lib/analytics";

interface ReservationCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: BrandTheme;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCompleteOrder: (reservation: ReservationDetails) => void;
  onOpenTerms?: () => void;
}

export const ReservationCheckoutModal: React.FC<ReservationCheckoutModalProps> = ({
  isOpen,
  onClose,
  theme,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCompleteOrder,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  const isWarm = theme === "warm-friendly";

  // Date setup (default delivery date = 3 days from today)
  const today = new Date();
  const defaultDelivery = new Date(today);
  defaultDelivery.setDate(today.getDate() + 3);

  // default pickup date = delivery + 14 days
  const defaultPickup = new Date(defaultDelivery);
  defaultPickup.setDate(defaultDelivery.getDate() + 14);

  const formatDateInput = (d: Date) => d.toISOString().split("T")[0];

  const [deliveryDate, setDeliveryDate] = useState(formatDateInput(defaultDelivery));
  const [pickupDate, setPickupDate] = useState(formatDateInput(defaultPickup));

  // Customer Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [aptSuite, setAptSuite] = useState("");
  const [city, setCity] = useState("Peoria");
  const [zipCode, setZipCode] = useState("61614");
  const [dropoffNotes, setDropoffNotes] = useState("");

  // Zip validation state
  const [zipMessage, setZipMessage] = useState<string | null>(null);
  const [isZipValid, setIsZipValid] = useState<boolean>(true);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(true);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Workspace state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [syncToSheets, setSyncToSheets] = useState(true);
  const [syncToGmail, setSyncToGmail] = useState(true);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [googleSyncNotice, setGoogleSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    initAuth(
      (u, tok) => {
        setGoogleUser(u);
        setGoogleToken(tok);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );

    // Track GA begin_checkout
    trackEvent("begin_checkout", {
      currency: "USD",
      items_count: cart.length,
    });
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningInGoogle(true);
    setGoogleSyncNotice(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        setGoogleSyncNotice("Connected to Google Workspace!");
      }
    } catch (err: any) {
      alert("Failed to connect Google account: " + err.message);
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  // Calculate rental duration in days and weeks
  const calcDays = () => {
    const start = new Date(deliveryDate);
    const end = new Date(pickupDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const totalDays = calcDays();
  const totalWeeks = Math.ceil(totalDays / 7);
  const extraWeeks = Math.max(0, totalWeeks - 2);

  // Total tote count in cart
  const totalTotesInCart = cart.reduce((acc, item) => {
    if (item.toteCount) return acc + item.toteCount * item.quantity;
    return acc;
  }, 0);

  // Subtotal base calculation
  const cartSubtotal = cart.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);

  // Extension Fee ($20 per extra week for bundles or $1.50/tote/extra week)
  const extensionFee = extraWeeks * Math.max(20, totalTotesInCart * EXTRA_WEEK_RATE_PER_TOTE);

  const storedCampaign = typeof window !== "undefined" ? sessionStorage.getItem("crate_key_campaign") : null;
  const isPostcard = (storedCampaign && storedCampaign.toLowerCase().includes("postcard")) || false;

  const tax = 0;
  // Delivery fee is either 0 (FREE) or confirmed upon contact. Exact charge is removed.
  const grandTotal = Math.round((cartSubtotal + extensionFee) * 100) / 100;

  // Validate Zip
  const handleZipValidation = async (z: string) => {
    setZipCode(z);
    if (z.length === 5) {
      if (isPostcard) {
        setIsZipValid(true);
        setIsFreeDelivery(true);
        setDeliveryFee(0);
        setZipMessage("Postcard Special Active: FREE delivery & pickup included on your tote reservation!");
        return;
      }

      try {
        const res = await fetch("/api/validate-zip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zip: z }),
        });
        const data = await res.json();
        setIsZipValid(data.eligible);
        setIsFreeDelivery(data.isFreeDelivery ?? false);
        setDeliveryFee(0);
        setZipMessage(data.message);
      } catch {
        const freeZips = ["61571", "61611", "61550", "61548", "61533", "61601", "61602", "61603", "61604", "61605", "61606"];
        const isFree = freeZips.includes(z);
        const ok = z.startsWith("61") || z.startsWith("62");
        setIsZipValid(ok);
        setIsFreeDelivery(isFree);
        setDeliveryFee(0);
        setZipMessage(
          isFree
            ? "ZIP eligible for FREE local 10-mile delivery & pickup!"
            : ok
            ? "ZIP is in our Central IL service area! Delivery & pickup options will be confirmed when we contact you."
            : "ZIP appears to be outside our standard Central IL service region."
        );
      }
    } else {
      setZipMessage(null);
    }
  };

  useEffect(() => {
    if (isOpen && zipCode) {
      handleZipValidation(zipCode);
    }
  }, [isOpen]);

  // Adjust return date automatically if user changes delivery date
  const handleDeliveryDateChange = (newDateStr: string) => {
    setDeliveryDate(newDateStr);
    const newDelivery = new Date(newDateStr);
    const newPickup = new Date(newDelivery);
    newPickup.setDate(newDelivery.getDate() + 14);
    setPickupDate(formatDateInput(newPickup));
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!fullName || !email || !phone || !address || !zipCode) {
      alert("Please fill in your contact and delivery address details.");
      return;
    }

    if (!isZipValid) {
      alert("Please enter a zip code within our 60-mile Peoria, IL service area.");
      return;
    }

    setIsSubmitting(true);

    const storedCampaign = typeof window !== "undefined" ? sessionStorage.getItem("crate_key_campaign") : null;
    const campaignSource = storedCampaign || "Direct / Organic Search";

    const reservation: ReservationDetails = {
      fullName,
      email,
      phone,
      deliveryAddress: `${address}${aptSuite ? `, ${aptSuite}` : ""}`,
      city,
      zipCode,
      deliveryDate,
      pickupDate,
      rentalWeeks: totalWeeks,
      dropoffNotes,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      isFreeDelivery,
      tax,
      total: grandTotal,
      campaignSource,
    };

    try {
      const fullDeliveryAddress = `${address}${aptSuite ? `, ${aptSuite}` : ""}`;
      // Submit Reservation Request
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: { fullName, email, phone, address: fullDeliveryAddress, zipCode, campaignSource, dropoffNotes },
          items: cart,
          deliveryDate,
          pickupDate,
          totalAmount: grandTotal,
          campaignSource,
          dropoffNotes,
          isRequestOnly: true,
        }),
      });
      const data = await res.json();
      reservation.confirmationCode = data.confirmationCode || "REQ-" + Math.floor(100000 + Math.random() * 900000);

      // Optional Google Workspace sync in background (non-blocking)
      if (googleToken) {
        (async () => {
          if (syncToSheets) {
            try {
              await appendReservationToGoogleSheet(googleToken, {
                ...reservation,
                streetAddress: address,
                pricing: { totalPrice: grandTotal },
              });
            } catch (sheetErr) {
              console.error("Google Sheets sync error:", sheetErr);
            }
          }
          if (syncToGmail) {
            try {
              await sendReservationEmailNotification(googleToken, {
                ...reservation,
                streetAddress: address,
                pricing: { totalPrice: grandTotal },
              });
            } catch (gmailErr) {
              console.error("Gmail notification error:", gmailErr);
            }
          }
        })();
      }

      // Track GA purchase / reservation request event
      trackEvent("purchase", {
        transaction_id: reservation.confirmationCode,
        value: grandTotal,
        currency: "USD",
        campaign_source: campaignSource,
        items: cart.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.pricePerUnit,
        })),
      });

      trackEvent("reservation_submitted", {
        confirmation_code: reservation.confirmationCode,
        value: grandTotal,
        campaign_source: campaignSource,
      });

      onCompleteOrder(reservation);
    } catch (err) {
      reservation.confirmationCode = "REQ-" + Math.floor(100000 + Math.random() * 900000);
      onCompleteOrder(reservation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D2A26]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] rounded-2xl max-w-4xl w-full p-4 sm:p-8 border border-[#EBE3D5] shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5]">
          <div className="space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-serif text-[#2D2A26] flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#5A6B5D]" />
              <span>Reserve Totes &amp; Schedule Delivery</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A08E79] hover:text-[#2D2A26] rounded-xl hover:bg-[#F5F2ED] transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E5DCCF] text-[#5A6B5D] mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-serif text-[#2D2A26]">Your Cart is Currently Empty</h4>
            <p className="text-xs text-[#5E5449] max-w-sm mx-auto">
              Choose a tote package or custom quantity from our catalog to start your reservation.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#5A6B5D] text-white text-xs font-bold transition"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          /* Checkout Form Layout */
          <form onSubmit={handleSubmitCheckout} className="space-y-6 max-w-2xl mx-auto">
            
            {/* Section 1: Rental Date Range */}
            <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#EBE3D5] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2D2A26] text-sm">
                  <span>1. Select Delivery &amp; Pickup Dates</span>
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5E5449] mb-1">
                    Delivery Date (Drop-Off)
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    min={formatDateInput(today)}
                    onChange={(e) => handleDeliveryDateChange(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-base sm:text-xs font-semibold rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5E5449] mb-1">
                    Pickup Date (Return)
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    min={deliveryDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-base sm:text-xs font-semibold rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26]"
                  />
                </div>
              </div>

              {extraWeeks > 0 ? (
                <div className="text-[11px] text-[#2D2A26] bg-[#E5DCCF] p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#A08E79] shrink-0" />
                  <span>Includes {extraWeeks} extra week extension (+${extensionFee} added to rental total).</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#A08E79]">
                  * Standard rental period is 2 weeks (14 days)
                </div>
              )}
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#EBE3D5] space-y-4">
              <h4 className="font-bold text-[#2D2A26] text-sm">
                <span>2. Delivery Address</span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#5E5449] mb-1">Street Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1200 N University St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">Apt / Suite / Unit</label>
                  <input
                    type="text"
                    placeholder="Apt 4B (Optional)"
                    value={aptSuite}
                    onChange={(e) => setAptSuite(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="Peoria"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    placeholder="61614"
                    value={zipCode}
                    maxLength={5}
                    onChange={(e) => handleZipValidation(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  {zipMessage && (
                    <div className={`p-2.5 rounded-xl text-[11px] font-semibold ${isZipValid ? "bg-[#F8FAF8] text-[#5A6B5D] border border-[#5A6B5D]/40" : "bg-rose-50 text-rose-900 border border-rose-200"}`}>
                      {zipMessage}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#5E5449] mb-1">Drop-Off Location Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Leave stacked on front porch / inside garage"
                    value={dropoffNotes}
                    onChange={(e) => setDropoffNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#EBE3D5] space-y-4">
              <h4 className="font-bold text-[#2D2A26] text-sm">3. Contact Information</h4>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E5449] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="(309) 886-5202"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#EBE3D5] bg-white text-[#2D2A26] text-base sm:text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Reservation Quote & Submission */}
            <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#EBE3D5] space-y-4">
              <h4 className="font-bold text-[#2D2A26] text-sm">
                4. Submit Reservation Request
              </h4>

              <div className="p-4 bg-white rounded-xl border border-[#5A6B5D]/30 space-y-1.5 text-xs">
                <div className="font-bold text-[#2D2A26]">
                  Reservation Request Only
                </div>
                <p className="text-[11px] text-[#5E5449] leading-relaxed">
                  Submitting this form submits a reservation request for your requested dates ({deliveryDate} to {pickupDate}). Our team will verify tote inventory and email your confirmation with invoice &amp; payment details prior to delivery.
                </p>
              </div>

              {/* Joined Reservation Quote Box */}
              <div className="bg-[#2D2A26] text-[#EBE3D5] rounded-xl p-5 space-y-5 shadow-md">
                <div className="flex items-center justify-between border-b border-[#3E362E] pb-3">
                  <h5 className="font-serif text-white text-base font-bold">
                    Reservation Quote Summary
                  </h5>
                  <span className="text-xs text-[#A08E79] font-bold">
                    {cart.length} item{cart.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#3E362E] rounded-xl p-3 text-xs space-y-1.5 border border-[#5E5449]/60"
                    >
                      <div className="flex justify-between items-start font-bold text-white">
                        <span>{item.name}</span>
                        <span>${item.pricePerUnit * item.quantity}</span>
                      </div>

                      {item.details && item.type !== "addon" && (
                        <p className="text-[11px] text-[#A08E79]">{item.details}</p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-5 h-5 rounded bg-[#2D2A26] hover:bg-[#1F1D1A] text-white flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-5 h-5 rounded bg-[#2D2A26] hover:bg-[#1F1D1A] text-white flex items-center justify-center font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-[#3E362E]">
                  <div className="flex justify-between text-[#A08E79]">
                    <span>Base Rental Subtotal:</span>
                    <span className="font-semibold text-white">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  {extensionFee > 0 && (
                    <div className="flex justify-between text-[#A08E79]">
                      <span>Rental Extension ({extraWeeks} extra wks):</span>
                      <span className="font-semibold">+${extensionFee.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center font-medium">
                    <span className="text-[#A08E79]">Delivery &amp; Pickup Fee:</span>
                    {isFreeDelivery || isPostcard ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <span>FREE</span>
                        {isPostcard && (
                          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                            Postcard Special
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-amber-200/90 font-medium italic">
                        Confirmed upon contact
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-[#3E362E]">
                    <span>Estimated Base Quote:</span>
                    <span className="text-[#A08E79] font-bold">${grandTotal.toFixed(2)}</span>
                  </div>

                  {!(isFreeDelivery || isPostcard) ? (
                    <p className="text-[10px] text-[#A08E79] text-right italic">
                      * Delivery &amp; pickup charges will be confirmed when our team contacts you
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-400 text-right font-medium">
                      ✓ Includes FREE delivery &amp; pickup
                    </p>
                  )}
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition shadow-md flex items-center justify-center gap-2 bg-[#A08E79] hover:bg-[#8C7B68] text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Reservation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#A08E79] text-center leading-normal">
                  We'll review your requested dates ({deliveryDate} to {pickupDate}) and contact you directly to confirm delivery.
                  {onOpenTerms && (
                    <span className="block mt-1">
                      By submitting your request, you agree to our{" "}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenTerms();
                        }}
                        className="underline text-[#A08E79] hover:text-[#8C7B68] font-medium"
                      >
                        Rental Terms &amp; Conditions
                      </button>
                      .
                    </span>
                  )}
                </p>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
