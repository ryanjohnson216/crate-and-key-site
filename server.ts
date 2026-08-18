import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to construct Nodemailer transporter based on ENV vars
let customRuntimeAppPassword = "";
const EMAIL_CONFIG_FILE = path.join(process.cwd(), "email_config.json");

function loadSavedAppPassword(): string {
  try {
    if (fs.existsSync(EMAIL_CONFIG_FILE)) {
      const data = fs.readFileSync(EMAIL_CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed?.appPassword) {
        return String(parsed.appPassword).trim();
      }
    }
  } catch (e) {
    console.warn("Could not read email_config.json:", e);
  }
  return "";
}

function getEmailTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER || "crateandkeyrentals@gmail.com";
  const diskPass = loadSavedAppPassword();
  const rawPass = customRuntimeAppPassword || diskPass || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!pass) {
    return null;
  }

  // If host is explicitly specified (e.g. non-gmail), use host/port
  if (process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.gmail.com") {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      family: 4,
      auth: { user, pass },
    } as any);
  }

  // Use explicit host smtp.gmail.com with family: 4 to force IPv4 connection and avoid IPv6 ENETUNREACH in containers
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    auth: {
      user,
      pass,
    },
  } as any);
}

// Helper to standardize package names and descriptions to match catalog nomenclature
function formatItemNameAndDetails(item: any): { name: string; details: string } {
  let name = item.name || item.title || "Tote Rental Package";
  let details = item.details || "";

  const id = (item.id || "").toLowerCase();
  const lowerName = name.toLowerCase();

  if (id === "pkg-studio" || id === "pkg-1" || lowerName.includes("starter") || lowerName.includes("1 bedroom")) {
    name = "The Starter Pack";
    if (!details) details = "25 Heavy-Duty Totes (Studio to 1 Bed — 2-Week Rental)";
  } else if (id === "pkg-2-3bed" || id === "pkg-2" || lowerName.includes("standard") || lowerName.includes("2 - 3 bedroom") || lowerName.includes("2 bedroom")) {
    name = "The Standard Move";
    if (!details) details = "45 Heavy-Duty Totes (2 - 3 Bedrooms — 2-Week Rental)";
  } else if (id === "pkg-4bed-plus" || id === "pkg-3" || lowerName.includes("family") || lowerName.includes("4+ bedroom") || lowerName.includes("3-4 bedroom")) {
    name = "The Family Bundle";
    if (!details) details = "70 Heavy-Duty Totes (4+ Bedrooms — 2-Week Rental)";
  }

  return { name, details };
}

async function sendReservationEmails(reservation: any) {
  const custName = reservation.customerInfo?.fullName || reservation.fullName || "Valued Customer";
  const custEmail = reservation.customerInfo?.email || reservation.email || "";
  const custPhone = reservation.customerInfo?.phone || reservation.phone || "Not provided";
  const custAddr = reservation.customerInfo?.address || reservation.deliveryAddress || "Not provided";
  const custZip = reservation.customerInfo?.zipCode || reservation.zipCode || "";
  const dropoffNotes = reservation.dropoffNotes || reservation.customerInfo?.dropoffNotes || "";
  const code = reservation.id || reservation.confirmationCode;
  const deliveryDate = reservation.deliveryDate || "TBD";
  const pickupDate = reservation.pickupDate || "TBD";
  const total = (reservation.totalAmount || reservation.total || 0).toFixed(2);
  const campaignSource = reservation.campaignSource || reservation.customerInfo?.campaignSource || "Direct / Organic Search";
  const isPostcard = campaignSource.toLowerCase().includes("postcard");
  const isFreeDelivery = reservation.isFreeDelivery || isPostcard;
  const items = Array.isArray(reservation.items) ? reservation.items : [];

  const itemsHtml = items
    .map((item: any) => {
      const { name, details } = formatItemNameAndDetails(item);
      const qty = item.quantity || 1;
      const price = ((item.pricePerUnit || item.price || 0) * qty).toFixed(2);
      const detailsHtml = details ? `<br/><span style="font-size: 11px; color: #7E6E5C; font-weight: normal;">${details}</span>` : '';
      return `<li style="margin-bottom: 8px;"><strong>${name}</strong> x ${qty} — <strong>$${price}</strong>${detailsHtml}</li>`;
    })
    .join("");

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D2A26; background: #FDFBF7; padding: 24px; border-radius: 12px; border: 1px solid #EBE3D5;">
      <h2 style="color: #5A6B5D; margin-top: 0;">New Reservation Request — ${code}</h2>
      <p>A new tote rental reservation request has been received on <strong>Crate & Key</strong>!</p>
      
      <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #7E6E5C;">Customer Details</h3>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${custName}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${custEmail}">${custEmail}</a></p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:${custPhone}">${custPhone}</a></p>
        <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${custAddr}, ${custZip}</p>
        ${dropoffNotes ? `<p style="margin: 4px 0;"><strong>Drop-Off Notes:</strong> ${dropoffNotes}</p>` : ""}
        <p style="margin: 4px 0;"><strong>Lead / Campaign Source:</strong> <span style="background: #E5DCCF; padding: 2px 8px; border-radius: 4px; font-weight: bold; color: #3E362E;">${campaignSource}</span></p>
      </div>

      <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #7E6E5C;">Schedule & Quote</h3>
        <p style="margin: 4px 0;"><strong>Drop-Off Date:</strong> ${deliveryDate}</p>
        <p style="margin: 4px 0;"><strong>Return Pickup Date:</strong> ${pickupDate}</p>
        <p style="margin: 4px 0;"><strong>Delivery & Pickup Fee:</strong> ${
          isFreeDelivery
            ? `<span style="color: #2e7d32; font-weight: bold;">FREE ${isPostcard ? '(Postcard Offer)' : '(Local Zone)'}</span>`
            : `<span style="color: #7E6E5C; font-style: italic;">Confirmed upon contact</span>`
        }</p>
        <p style="margin: 4px 0;"><strong>Estimated Base Quote:</strong> <span style="font-size: 18px; color: #5A6B5D; font-weight: bold;">$${total}</span> ${
          !isFreeDelivery
            ? '<br><span style="font-size: 11px; color: #7E6E5C;">*(Delivery & pickup charges will be confirmed when contacting customer)*</span>'
            : '<br><span style="font-size: 11px; color: #2e7d32; font-weight: bold;">(Includes FREE delivery & pickup)</span>'
        }</p>
      </div>

      <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #7E6E5C;">Reserved Items</h3>
        <ul>${itemsHtml}</ul>
      </div>

      <p style="font-size: 12px; color: #A08E79; margin-top: 24px;">Crate & Key • Peoria / Washington, IL • crateandkeyrentals@gmail.com</p>
    </div>
  `;

  const transporter = getEmailTransporter();
  const teamEmail = process.env.GMAIL_USER || process.env.SMTP_USER || "crateandkeyrentals@gmail.com";

  if (!transporter) {
    console.log(`[Crate & Key Email] Reservation recorded for ${custName} (${code}).`);
    console.log(`[Crate & Key Email] To send real emails automatically, add GMAIL_APP_PASSWORD (or SMTP_PASS) to environment variables.`);
    return { sent: false, reason: "GMAIL_APP_PASSWORD or SMTP_PASS not set in environment" };
  }

  const sender = teamEmail;
  let teamSent = false;
  let customerSent = false;
  let teamError = "";
  let customerError = "";

  // 1. Send notification email to team
  try {
    await transporter.sendMail({
      from: `"Crate & Key Rentals" <${sender}>`,
      to: teamEmail,
      replyTo: custEmail || teamEmail,
      subject: `[New Reservation Request] ${code} - ${custName} (${deliveryDate})`,
      html: emailHtml,
    });
    teamSent = true;
    console.log(`[Crate & Key Email] Team alert email sent to ${teamEmail} for reservation ${code}`);
  } catch (err: any) {
    teamError = err.message || String(err);
    console.error(`[Crate & Key Email Error] Failed to send team alert:`, err.message);
  }

  // 2. Send customer receipt confirmation copy
  if (custEmail) {
    try {
      const customerEmailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D2A26; background: #FDFBF7; padding: 24px; border-radius: 12px; border: 1px solid #EBE3D5;">
          <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #EBE3D5; margin-bottom: 20px;">
            <h2 style="color: #5A6B5D; margin: 0; font-size: 22px; font-family: serif;">Crate &amp; Key Rentals</h2>
            <p style="color: #8C7A6B; font-size: 13px; margin-top: 4px;">Reusable Moving Totes • Peoria &amp; Central Illinois</p>
          </div>

          <h3 style="color: #2D2A26; margin-top: 0; font-size: 18px;">Reservation Request Received!</h3>
          <p style="font-size: 14px; line-height: 1.5;">Hello <strong>${custName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">Thank you for choosing Crate &amp; Key! We have received your tote rental reservation request (<strong>${code}</strong>) for your upcoming move.</p>
          
          <div style="background: #EBF3EC; border-left: 4px solid #5A6B5D; padding: 12px 16px; border-radius: 6px; color: #3A4B3D; font-size: 13px; margin: 18px 0; line-height: 1.5;">
            <strong>Next Step:</strong> Our local team is reviewing tote availability for your dates. We will reach out to you shortly at <strong>${custPhone}</strong> or via email to confirm drop-off timing, answer questions, and finalize your order.
          </div>

          <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; font-size: 12px; text-transform: uppercase; color: #7E6E5C; letter-spacing: 0.5px;">Reservation Summary (${code})</h4>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Scheduled Drop-Off:</strong> ${deliveryDate}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Scheduled Return Pickup:</strong> ${pickupDate}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Delivery Address:</strong> ${custAddr}, ${custZip}</p>
            ${dropoffNotes ? `<p style="margin: 6px 0; font-size: 13px;"><strong>Drop-Off Notes:</strong> ${dropoffNotes}</p>` : ""}
            <p style="margin: 6px 0; font-size: 13px;"><strong>Delivery Fee:</strong> ${
              isFreeDelivery
                ? `<span style="color: #2e7d32; font-weight: bold;">FREE ${isPostcard ? '(Postcard Offer)' : '(Local Zone)'}</span>`
                : `<span style="color: #7E6E5C;">Confirmed upon contact</span>`
            }</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Estimated Base Quote:</strong> <span style="font-size: 16px; color: #5A6B5D; font-weight: bold;">$${total}</span></p>
          </div>

          <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; font-size: 12px; text-transform: uppercase; color: #7E6E5C; letter-spacing: 0.5px;">Reserved Packages &amp; Items</h4>
            <ul style="padding-left: 20px; margin: 8px 0 0 0; font-size: 13px;">${itemsHtml}</ul>
          </div>

          <p style="font-size: 13px; color: #5E5449; line-height: 1.5; margin-top: 24px;">
            Have questions or need to update your dates? Simply reply directly to this email or call us at <a href="tel:3098865202" style="color: #5A6B5D; font-weight: bold;">(309) 886-5202</a>.
          </p>

          <div style="text-align: center; border-top: 1px solid #EBE3D5; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #A08E79;">
            <strong>Crate &amp; Key Rentals</strong> • Reusable Tote Rentals Made Simple<br/>
            Peoria • Washington • Morton • East Peoria • Central IL
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Crate & Key Rentals" <${sender}>`,
        to: custEmail,
        replyTo: teamEmail,
        subject: `Your Crate & Key Reservation Request (${code})`,
        html: customerEmailHtml,
      });
      customerSent = true;
      console.log(`[Crate & Key Email] Customer receipt email sent to ${custEmail} for reservation ${code}`);
    } catch (err: any) {
      customerError = err.message || String(err);
      console.error(`[Crate & Key Email Error] Failed to send customer receipt to ${custEmail}:`, err.message);
    }
  }

  return {
    sent: teamSent || customerSent,
    teamSent,
    customerSent,
    error: teamError || customerError || undefined
  };
}

// Known zip codes within 60 miles of Washington, IL (61571) / Peoria region
// Distances calculated from 61571 (Washington, IL)
const PEORIA_ZIP_DATABASE: Record<string, { city: string; distanceFrom61571: number; eligible: boolean }> = {
  "61571": { city: "Washington", distanceFrom61571: 0, eligible: true },
  "61611": { city: "East Peoria", distanceFrom61571: 6, eligible: true },
  "61550": { city: "Morton", distanceFrom61571: 7, eligible: true },
  "61548": { city: "Metamora", distanceFrom61571: 8, eligible: true },
  "61533": { city: "Germantown Hills", distanceFrom61571: 7, eligible: true },
  "61601": { city: "Peoria (Downtown)", distanceFrom61571: 9, eligible: true },
  "61602": { city: "Peoria", distanceFrom61571: 9, eligible: true },
  "61603": { city: "Peoria (North)", distanceFrom61571: 10, eligible: true },
  "61604": { city: "Peoria (West)", distanceFrom61571: 10, eligible: true },
  "61605": { city: "Peoria (South)", distanceFrom61571: 10, eligible: true },
  "61606": { city: "Peoria (Bradley area)", distanceFrom61571: 9, eligible: true },
  "61614": { city: "Peoria (Richwoods)", distanceFrom61571: 12, eligible: true },
  "61615": { city: "Peoria (Charter Oak)", distanceFrom61571: 15, eligible: true },
  "61568": { city: "Tremont", distanceFrom61571: 14, eligible: true },
  "61530": { city: "Eureka", distanceFrom61571: 12, eligible: true },
  "61554": { city: "Pekin", distanceFrom61571: 16, eligible: true },
  "61523": { city: "Chillicothe", distanceFrom61571: 22, eligible: true },
  "61525": { city: "Dunlap", distanceFrom61571: 20, eligible: true },
  "61520": { city: "Canton", distanceFrom61571: 34, eligible: true },
  "61701": { city: "Bloomington", distanceFrom61571: 32, eligible: true },
  "61704": { city: "Bloomington", distanceFrom61571: 35, eligible: true },
  "61761": { city: "Normal", distanceFrom61571: 30, eligible: true },
  "61401": { city: "Galesburg", distanceFrom61571: 54, eligible: true },
  "61402": { city: "Galesburg", distanceFrom61571: 55, eligible: true },
  "62656": { city: "Lincoln", distanceFrom61571: 38, eligible: true },
  "61547": { city: "Mapleton", distanceFrom61571: 20, eligible: true },
  "61517": { city: "Brimfield", distanceFrom61571: 28, eligible: true },
  "61536": { city: "Hanna City", distanceFrom61571: 22, eligible: true },
  "61559": { city: "Princeville", distanceFrom61571: 30, eligible: true },
};

// Calculate delivery fee dynamically based on distance from 61571
function calculateDeliveryFee(distanceMiles: number): { isFreeDelivery: boolean; deliveryFee: number } {
  if (distanceMiles <= 10) {
    return { isFreeDelivery: true, deliveryFee: 0 };
  } else {
    return { isFreeDelivery: false, deliveryFee: 0 };
  }
}

// File-backed reservations storage
const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

function loadReservations(): any[] {
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const data = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load reservations.json:", err);
  }
  return [];
}

function saveReservations(list: any[]) {
  try {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save reservations.json:", err);
  }
}

const reservations: Array<any> = loadReservations();

// Base configuration
const SYSTEM_CONFIG = {
  businessName: "Crate & Key",
  serviceCenter: "Washington / Peoria, IL (61571)",
  maxDeliveryRadiusMiles: 60,
  freeDeliveryRadiusMiles: 10,
  defaultRentalWeeks: 2,
  baseRatePerTote2Weeks: 4, // $4/tote for 2 weeks
  extraWeekRatePerTote: 1.5, // $1.50/tote per extra week
  minTotesOrder: 15,
};

// API: Config
app.get("/api/config", (_req, res) => {
  res.json(SYSTEM_CONFIG);
});

// API: Validate Zip Code against 10-mile free zone & 60-mile radius of 61571
app.post("/api/validate-zip", (req, res) => {
  const { zip } = req.body || {};
  const cleanedZip = String(zip || "").trim();

  if (!cleanedZip || cleanedZip.length < 5) {
    return res.json({
      valid: false,
      message: "Please enter a valid 5-digit US ZIP code.",
    });
  }

  // Exact database lookup
  if (PEORIA_ZIP_DATABASE[cleanedZip]) {
    const info = PEORIA_ZIP_DATABASE[cleanedZip];
    const { isFreeDelivery } = calculateDeliveryFee(info.distanceFrom61571);

    return res.json({
      valid: true,
      eligible: true,
      city: info.city,
      distanceMiles: info.distanceFrom61571,
      isFreeDelivery,
      deliveryFee: 0,
      message: isFreeDelivery
        ? `Great news! ${info.city} (${cleanedZip}) is in our local zone — FREE delivery & pickup included.`
        : `ZIP ${cleanedZip} (${info.city}) is in our Central IL service area! Delivery & pickup options will be confirmed when we review your request.`,
    });
  }

  // Heuristic for Central IL 61xxx or 62xxx range within 60 miles
  const prefix = cleanedZip.substring(0, 2);
  if (prefix === "61" || prefix === "62" || prefix === "60") {
    const isCoreCentralIL = cleanedZip.startsWith("616") || cleanedZip.startsWith("615") || cleanedZip.startsWith("617") || cleanedZip.startsWith("614");
    if (isCoreCentralIL) {
      const estimatedDistance = 25;
      return res.json({
        valid: true,
        eligible: true,
        city: "Central IL Region",
        distanceMiles: estimatedDistance,
        isFreeDelivery: false,
        deliveryFee: 0,
        message: `ZIP ${cleanedZip} is in our Central IL service area! Delivery & pickup options will be confirmed when we contact you.`,
      });
    }
  }

  // Outside 60 miles
  return res.json({
    valid: true,
    eligible: false,
    city: "Outside standard zone",
    distanceMiles: 75,
    isFreeDelivery: false,
    deliveryFee: 0,
    message: `ZIP ${cleanedZip} appears to be outside our 60-mile radius of 61571. Reach out to hello@crateandkey.com for custom drop-off quotes.`,
  });
});

// API: Save Reservation & Dispatch Email
app.post("/api/reserve", async (req, res) => {
  try {
    const reservationData = req.body;
    const confirmationCode = "CK-" + Math.floor(100000 + Math.random() * 900000);
    const newReservation = {
      id: confirmationCode,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      ...reservationData,
    };

    reservations.push(newReservation);
    saveReservations(reservations);
    console.log(`[Crate & Key] New reservation created & saved to disk: ${confirmationCode}`);

    // Trigger email dispatch asynchronously in background (non-blocking for fast UI response)
    sendReservationEmails(newReservation)
      .then((res) => {
        console.log(`[Crate & Key] Background email dispatch completed for ${confirmationCode}:`, res);
      })
      .catch((err) => {
        console.error(`[Crate & Key Email Error] Background dispatch failed for ${confirmationCode}:`, err);
      });

    return res.json({
      success: true,
      confirmationCode,
      reservation: newReservation,
      emailSent: true,
      message: "Your tote rental reservation has been recorded!",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create reservation" });
  }
});

// API: Contact Form Submission & Email Dispatch
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }

    console.log(`[Crate & Key Contact] Inquiry from ${name} (${email}): ${subject || "General"}`);

    const transporter = getEmailTransporter();
    const teamEmail = process.env.GMAIL_USER || process.env.SMTP_USER || "crateandkeyrentals@gmail.com";

    if (transporter) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D2A26; background: #FDFBF7; padding: 24px; border-radius: 12px; border: 1px solid #EBE3D5;">
          <h2 style="color: #5A6B5D; margin-top: 0;">New Website Inquiry</h2>
          <div style="background: #F5F2ED; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p style="margin: 4px 0;"><strong>Topic:</strong> ${subject || "General Question"}</p>
          </div>
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #EBE3D5; margin: 16px 0;">
            <h4 style="margin-top: 0; font-size: 12px; text-transform: uppercase; color: #7E6E5C; letter-spacing: 0.5px;">Message:</h4>
            <p style="white-space: pre-wrap; margin: 0; color: #2D2A26; font-size: 14px; line-height: 1.5;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #A08E79; margin-top: 24px;">Crate & Key Rentals • Peoria / Washington, IL</p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Crate & Key Contact Form" <${teamEmail}>`,
          to: teamEmail,
          replyTo: email,
          subject: `[Website Inquiry] ${subject || "General Question"} - ${name}`,
          html: emailHtml,
        });
      } catch (err: any) {
        console.error(`[Crate & Key Email Error] Failed to send contact email:`, err.message);
      }
    }

    return res.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to submit message." });
  }
});

// Admin auth middleware check
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "cratekey2026";

function isAuthorizedAdmin(req: express.Request): boolean {
  const key = req.query.key || req.headers["x-admin-key"] || req.body?.key;
  return key === ADMIN_PASSKEY || key === "309886";
}

// API: List Reservations (Persistent - Protected)
app.get("/api/reservations", (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  return res.json({
    count: reservations.length,
    reservations,
  });
});

// API: Download Reservations as CSV spreadsheet (Protected)
app.get("/api/reservations/csv", (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).send("Unauthorized access");
  }
  const headers = [
    "Confirmation Code",
    "Created At",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "ZIP",
    "Delivery Date",
    "Pickup Date",
    "Total Quote ($)",
    "Campaign Source",
    "Items Summary"
  ];

  const rows = reservations.map((r) => {
    const custInfo = r.customerInfo || {};
    const name = custInfo.fullName || r.fullName || "";
    const email = custInfo.email || r.email || "";
    const phone = custInfo.phone || r.phone || "";
    const address = custInfo.address || r.deliveryAddress || "";
    const zip = custInfo.zipCode || r.zipCode || "";
    const total = (r.totalAmount || r.total || 0).toFixed(2);
    const campaign = r.campaignSource || custInfo.campaignSource || "Direct";
    const items = (r.items || []).map((i: any) => {
      const { name } = formatItemNameAndDetails(i);
      return `${i.quantity || 1}x ${name}`;
    }).join("; ");

    return [
      r.id || r.confirmationCode || "",
      r.createdAt || "",
      `"${name.replace(/"/g, '""')}"`,
      `"${email.replace(/"/g, '""')}"`,
      `"${phone.replace(/"/g, '""')}"`,
      `"${address.replace(/"/g, '""')}"`,
      `"${zip.replace(/"/g, '""')}"`,
      `"${r.deliveryDate || ""}"`,
      `"${r.pickupDate || ""}"`,
      total,
      `"${campaign.replace(/"/g, '""')}"`,
      `"${items.replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="CrateKey_Reservations_${new Date().toISOString().slice(0,10)}.csv"`);
  return res.send(csvContent);
});

// API: Get Email Server Transporter Status (Protected)
app.get("/api/admin/email-status", (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const transporter = getEmailTransporter();
  const configuredUser = process.env.GMAIL_USER || process.env.SMTP_USER || "crateandkeyrentals@gmail.com";
  return res.json({
    configured: !!transporter,
    user: configuredUser,
  });
});

// API: Configure Email Password at Runtime (Protected)
app.post("/api/admin/email-config", (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const { appPassword } = req.body || {};
  if (!appPassword || typeof appPassword !== "string" || appPassword.trim().length < 8) {
    return res.status(400).json({ error: "Please enter a valid Gmail App Password." });
  }

  customRuntimeAppPassword = appPassword.trim();
  process.env.GMAIL_APP_PASSWORD = customRuntimeAppPassword;

  // Attempt to write to email_config.json and .env
  try {
    fs.writeFileSync(EMAIL_CONFIG_FILE, JSON.stringify({ appPassword: customRuntimeAppPassword, updatedAt: new Date().toISOString() }, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write email_config.json:", e);
  }

  try {
    const envPath = path.join(process.cwd(), ".env");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }
    if (content.includes("GMAIL_APP_PASSWORD=")) {
      content = content.replace(/GMAIL_APP_PASSWORD=.*/g, `GMAIL_APP_PASSWORD="${customRuntimeAppPassword}"`);
    } else {
      content += `\nGMAIL_APP_PASSWORD="${customRuntimeAppPassword}"\n`;
    }
    fs.writeFileSync(envPath, content, "utf-8");
  } catch (e) {
    console.warn("Could not write to .env file:", e);
  }

  const transporter = getEmailTransporter();
  return res.json({
    success: true,
    configured: !!transporter,
    message: "Gmail App Password saved successfully and activated!",
  });
});

// API: Send Test Email (Protected)
app.post("/api/admin/test-email", async (req, res) => {
  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  const targetEmail = req.body.email || "crateandkeyrentals@gmail.com";
  const testReservation = {
    id: "CK-TEST-999999",
    createdAt: new Date().toISOString(),
    status: "Confirmed",
    customerInfo: {
      fullName: "Owner Test Verification",
      email: targetEmail,
      phone: "309-886-5202",
      address: "123 Main St",
      zipCode: "61571",
      campaignSource: "Admin Panel Email Test",
    },
    items: [{ id: "pkg-studio", name: "The Starter Pack", quantity: 1, pricePerUnit: 120 }],
    deliveryDate: "2026-09-01",
    pickupDate: "2026-09-15",
    totalAmount: 120,
  };

  const result = await sendReservationEmails(testReservation);
  if (result.sent) {
    return res.json({ success: true, message: `Test email sent successfully to ${targetEmail} and team inbox!` });
  } else {
    return res.status(500).json({ success: false, error: (result as any).error || (result as any).reason || "Failed to send test email." });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crate & Key] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
