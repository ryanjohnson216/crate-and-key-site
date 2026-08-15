import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Configured OAuth Scopes
export const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/gmail.send",
];

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = localStorage.getItem("crate_key_google_access_token");
let cachedUser: User | null = null;

// Initialize Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    cachedUser = user;
    const storedToken = localStorage.getItem("crate_key_google_access_token");
    const token = cachedAccessToken || storedToken;

    if (user && token) {
      cachedAccessToken = token;
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      if (!isSigningIn) {
        if (!user) {
          cachedAccessToken = null;
          localStorage.removeItem("crate_key_google_access_token");
        }
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

// Sign in with Google
export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve access token from Google Auth");
    }

    cachedAccessToken = credential.accessToken;
    localStorage.setItem("crate_key_google_access_token", credential.accessToken);
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Workspace Sign-in error:", error);
    if (
      error?.code === "auth/unauthorized-domain" ||
      error?.message?.includes("unauthorized-domain") ||
      error?.message?.includes("unauthorized domain")
    ) {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "this domain";
      throw new Error(
        `Authorized Domain Notice: The domain '${hostname}' is not listed in your Firebase Console's Authorized Domains list (Firebase Console > Authentication > Settings > Authorized Domains). Use the 'Download CSV' button at the top to export all reservations directly into Google Sheets or Excel.`
      );
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || localStorage.getItem("crate_key_google_access_token");
};

export const getCachedUser = (): User | null => {
  return cachedUser;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedUser = null;
  localStorage.removeItem("crate_key_google_access_token");
};

// --- GOOGLE SHEETS HELPER ---
const SPREADSHEET_ID_STORAGE_KEY = "crate_key_google_sheet_id";

export const getOrCreateReservationsSheet = async (
  accessToken: string
): Promise<string> => {
  const existingId = localStorage.getItem(SPREADSHEET_ID_STORAGE_KEY);
  if (existingId) {
    // Verify sheet exists
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${existingId}?fields=spreadsheetId`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.ok) {
        return existingId;
      }
    } catch {
      // Create new sheet below if old one invalid
    }
  }

  // Create new Spreadsheet
  const createRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: { title: "Crate & Key - Customer Reservations" },
        sheets: [
          {
            properties: {
              title: "Reservations",
              gridProperties: { frozenRowCount: 1 },
            },
          },
        ],
      }),
    }
  );

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Sheet: ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Add Headers
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reservations!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            "Confirmation Code",
            "Created At",
            "Customer Name",
            "Email",
            "Phone",
            "Street Address",
            "City",
            "ZIP",
            "Delivery Date",
            "Pickup Date",
            "Total Amount",
            "Items Summary",
          ],
        ],
      }),
    }
  );

  localStorage.setItem(SPREADSHEET_ID_STORAGE_KEY, spreadsheetId);
  return spreadsheetId;
};

export const appendReservationToGoogleSheet = async (
  accessToken: string,
  reservation: any
) => {
  const spreadsheetId = await getOrCreateReservationsSheet(accessToken);

  const itemsSummary = (reservation.items || [])
    .map((i: any) => `${i.quantity}x ${i.name}`)
    .join(", ");

  const rowValues = [
    reservation.id || reservation.confirmationCode || "",
    reservation.createdAt || new Date().toLocaleString(),
    reservation.fullName || "",
    reservation.email || "",
    reservation.phone || "",
    reservation.streetAddress || "",
    reservation.city || "",
    reservation.zipCode || "",
    reservation.deliveryDate || "",
    reservation.pickupDate || "",
    `$${(reservation.pricing?.totalPrice || 0).toFixed(2)}`,
    itemsSummary,
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reservations!A:L:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    throw new Error(`Failed to append row to Google Sheet: ${errText}`);
  }

  return spreadsheetId;
};

export const syncAllReservationsToGoogleSheet = async (accessToken: string, passkey: string = "cratekey2026") => {
  const spreadsheetId = await getOrCreateReservationsSheet(accessToken);

  // Fetch all reservations from server with admin key
  const res = await fetch(`/api/reservations?key=${encodeURIComponent(passkey)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch reservations from server");
  }
  const list = data.reservations || [];

  const rows = list.map((r: any) => {
    const custInfo = r.customerInfo || {};
    const itemsSummary = (r.items || [])
      .map((i: any) => `${i.quantity || 1}x ${i.name || i.title}`)
      .join(", ");

    return [
      r.id || r.confirmationCode || "",
      r.createdAt || new Date().toLocaleString(),
      custInfo.fullName || r.fullName || "",
      custInfo.email || r.email || "",
      custInfo.phone || r.phone || "",
      custInfo.address || r.deliveryAddress || "",
      r.city || "Peoria Area",
      custInfo.zipCode || r.zipCode || "",
      r.deliveryDate || "",
      r.pickupDate || "",
      `$${(r.totalAmount || r.total || 0).toFixed(2)}`,
      itemsSummary,
    ];
  });

  if (rows.length > 0) {
    // Overwrite values starting from A2
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reservations!A2:L${rows.length + 5}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: rows,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Failed to sync rows to Google Sheet: ${errText}`);
    }
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    count: list.length,
  };
};

// --- GMAIL HELPER ---
function utf8ToBase64Url(str: string): string {
  // Convert UTF-8 string to base64url
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const sendReservationEmailNotification = async (
  accessToken: string,
  reservation: any
) => {
  const custEmail = reservation.customerInfo?.email || reservation.email || "";
  const teamEmail = "crateandkeyrentals@gmail.com";
  const recipients = Array.from(new Set([custEmail, teamEmail])).filter(Boolean);

  if (recipients.length === 0) return;

  const code = reservation.id || reservation.confirmationCode || "CK-XXXXXX";
  const custName = reservation.customerInfo?.fullName || reservation.fullName || "Valued Customer";
  const custPhone = reservation.customerInfo?.phone || reservation.phone || "Not provided";
  const custAddr = reservation.customerInfo?.address || reservation.streetAddress || reservation.deliveryAddress || "Not provided";
  const custZip = reservation.customerInfo?.zipCode || reservation.zipCode || "";
  const total = (reservation.totalAmount || reservation.total || reservation.pricing?.totalPrice || 0).toFixed(2);
  const deliveryDate = reservation.deliveryDate || "TBD";
  const pickupDate = reservation.pickupDate || "TBD";

  const itemsList = (reservation.items || [])
    .map((i: any) => {
      let name = i.name || i.title || "Tote Rental Package";
      let details = i.details || "";
      const id = (i.id || "").toLowerCase();
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

      const detailsHtml = details ? `<br/><span style="font-size: 11px; color: #7E6E5C;">${details}</span>` : "";
      return `<li><strong>${i.quantity || 1}x ${name}</strong> ($${((i.pricePerUnit || i.price || 0) * (i.quantity || 1)).toFixed(2)})${detailsHtml}</li>`;
    })
    .join("");

  const results = [];

  for (const recipient of recipients) {
    const isTeam = recipient === teamEmail;
    const subject = isTeam
      ? `[New Reservation Request] ${code} - ${custName}`
      : `Your Crate & Key Reservation Request (${code})`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDFBF7; color: #3E362E; margin: 0; padding: 20px; }
    .card { background: #ffffff; border: 1px solid #EBE3D5; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 30px; }
    .header { border-bottom: 2px solid #5A6B5D; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
    .code { font-size: 22px; font-weight: bold; color: #5A6B5D; letter-spacing: 1px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details-table td { padding: 8px 0; border-bottom: 1px solid #F3EDE2; }
    .footer { margin-top: 30px; font-size: 12px; color: #A08E79; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin:0; color:#3E362E; font-family: serif;">Crate &amp; Key Rentals</h2>
      <p style="margin:5px 0 0 0; color:#5A6B5D; font-size: 13px;">Reusable Moving Totes • Peoria &amp; Central Illinois</p>
    </div>
    <h3 style="color: #2D2A26;">${isTeam ? "New Reservation Request Received" : "Reservation Request Received!"}</h3>
    <p>Hello <strong>${isTeam ? "Crate & Key Team" : custName}</strong>,</p>
    <p>${isTeam ? `A new reservation request (<strong>${code}</strong>) was placed on the website:` : `Thank you for choosing Crate & Key for your upcoming move! We have received your reservation request (<strong>${code}</strong>).`}</p>
    
    <div style="background:#F5F2ED; padding:15px; border-radius:8px; margin:20px 0;">
      <span style="font-size:12px; text-transform:uppercase; color:#7E6E5C; font-weight:bold;">Confirmation Code</span><br/>
      <span class="code">${code}</span>
    </div>

    <h4>Customer Details:</h4>
    <table class="details-table">
      <tr><td><strong>Name:</strong></td><td>${custName}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${custEmail}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${custPhone}</td></tr>
      <tr><td><strong>Delivery Address:</strong></td><td>${custAddr}, ${custZip}</td></tr>
      <tr><td><strong>Scheduled Drop-Off:</strong></td><td>${deliveryDate}</td></tr>
      <tr><td><strong>Scheduled Return Pickup:</strong></td><td>${pickupDate}</td></tr>
      <tr><td><strong>Estimated Base Quote:</strong></td><td><strong>$${total}</strong></td></tr>
    </table>

    <h4>Reserved Items:</h4>
    <ul>${itemsList}</ul>

    <p style="margin-top:20px;">${isTeam ? "Please follow up with the customer to confirm delivery timing." : "Our local team will review tote availability for your dates and reach out to confirm drop-off details."}</p>

    <div class="footer">
      <p>Crate & Key • Peoria / Washington, IL • crateandkeyrentals@gmail.com • (309) 886-5202</p>
    </div>
  </div>
</body>
</html>`;

    const rawBase64 = utf8ToBase64Url(`To: ${recipient}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${emailHtml}`);

    const sendRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: rawBase64 }),
      }
    );

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      console.error(`Failed to send email to ${recipient} via Gmail API:`, errText);
    } else {
      results.push(await sendRes.json());
    }
  }

  return results;
};
