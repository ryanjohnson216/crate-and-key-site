import React, { useState } from "react";
import { BrandTheme } from "../types";
import { Send, CheckCircle2, Facebook, Instagram, AlertCircle } from "lucide-react";

interface ContactSectionProps {
  theme: BrandTheme;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Question",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-[#F5F2ED] border-t border-[#EBE3D5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBE3D5] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Header Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] tracking-tight">
              Send us a message
            </h2>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#E5DCCF] text-[#5A6B5D] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2D2A26]">
                Message Received!
              </h3>
              <p className="text-sm text-[#5E5449] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Crate &amp; Key. Our team has received your message and will get back to you shortly!
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "General Question",
                    message: "",
                  });
                }}
                className="px-5 py-2 rounded-xl bg-[#EBE3D5] hover:bg-[#D9CEBA] text-xs font-bold text-[#2D2A26] transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D2A26]">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#2D2A26] placeholder-[#A08E79] focus:outline-none focus:ring-2 focus:ring-[#A08E79]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D2A26]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#2D2A26] placeholder-[#A08E79] focus:outline-none focus:ring-2 focus:ring-[#A08E79]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D2A26]">
                    Phone Number <span className="text-xs font-normal text-[#8C7B68]">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(309) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#2D2A26] placeholder-[#A08E79] focus:outline-none focus:ring-2 focus:ring-[#A08E79]"
                  />
                </div>

                {/* Topic / Subject */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D2A26]">
                    Topic
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#A08E79]"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Custom Delivery / Zone Check">Custom Delivery / Zone Check</option>
                    <option value="Commercial / Large Business Move">Commercial / Large Business Move</option>
                    <option value="Existing Reservation Inquiry">Existing Reservation Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D2A26]">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help with your upcoming move?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#2D2A26] placeholder-[#A08E79] focus:outline-none focus:ring-2 focus:ring-[#A08E79] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#A08E79] hover:bg-[#8C7B68] text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Social Links Directly Underneath Form */}
          <div className="pt-6 border-t border-[#EBE3D5] space-y-3">
            <p className="text-xs font-bold text-[#8C7B68] uppercase tracking-wider">
              Follow &amp; connect with us on socials
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.facebook.com/crateandkey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#1877F2] text-white text-xs font-bold transition shadow-xs group"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4 text-[#A08E79] group-hover:text-white transition" />
                <span>Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/crate-and-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D2A26] hover:bg-[#E4405F] text-white text-xs font-bold transition shadow-xs group"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4 text-[#A08E79] group-hover:text-white transition" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

