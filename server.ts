import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  } else if (distanceMiles <= 20) {
    return { isFreeDelivery: false, deliveryFee: 25 };
  } else if (distanceMiles <= 30) {
    return { isFreeDelivery: false, deliveryFee: 35 };
  } else if (distanceMiles <= 45) {
    return { isFreeDelivery: false, deliveryFee: 50 };
  } else if (distanceMiles <= 60) {
    return { isFreeDelivery: false, deliveryFee: 75 };
  } else {
    return { isFreeDelivery: false, deliveryFee: 0 };
  }
}

// In-memory reservations database
const reservations: Array<any> = [];

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
    const { isFreeDelivery, deliveryFee } = calculateDeliveryFee(info.distanceFrom61571);

    return res.json({
      valid: true,
      eligible: true,
      city: info.city,
      distanceMiles: info.distanceFrom61571,
      isFreeDelivery,
      deliveryFee,
      message: isFreeDelivery
        ? `Great news! ${info.city} (${cleanedZip}) is within 10 miles of 61571! FREE delivery & pickup included.`
        : `ZIP ${cleanedZip} (${info.city}) is approx ${info.distanceFrom61571} miles from 61571. Delivery & pickup fee: $${deliveryFee}.`,
    });
  }

  // Heuristic for Central IL 61xxx or 62xxx range within 60 miles
  const prefix = cleanedZip.substring(0, 2);
  if (prefix === "61" || prefix === "62" || prefix === "60") {
    const isCoreCentralIL = cleanedZip.startsWith("616") || cleanedZip.startsWith("615") || cleanedZip.startsWith("617") || cleanedZip.startsWith("614");
    if (isCoreCentralIL) {
      const estimatedDistance = 25;
      const { isFreeDelivery, deliveryFee } = calculateDeliveryFee(estimatedDistance);
      return res.json({
        valid: true,
        eligible: true,
        city: "Central IL Region",
        distanceMiles: estimatedDistance,
        isFreeDelivery,
        deliveryFee,
        message: `ZIP ${cleanedZip} is within our 60-mile service region! Pickup & delivery available for a $${deliveryFee} local delivery fee.`,
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

// API: Save Reservation
app.post("/api/reserve", (req, res) => {
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
    console.log(`[Crate & Key] New reservation created: ${confirmationCode}`);

    return res.json({
      success: true,
      confirmationCode,
      reservation: newReservation,
      message: "Your tote rental reservation has been recorded!",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || "Failed to create reservation" });
  }
});

// API: List Reservations (In-memory)
app.get("/api/reservations", (_req, res) => {
  return res.json({
    count: reservations.length,
    reservations,
  });
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
