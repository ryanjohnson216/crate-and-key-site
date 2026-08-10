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
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Initialize Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    cachedUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
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
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Workspace Sign-in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCachedUser = (): User | null => {
  return cachedUser;
};

export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  cachedUser = null;
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
  const recipient = reservation.email;
  if (!recipient) return;

  const code = reservation.id || reservation.confirmationCode || "CK-XXXXXX";
  const itemsList = (reservation.items || [])
    .map((i: any) => `<li><strong>${i.quantity}x ${i.name}</strong> ($${(i.pricePerUnit * i.quantity).toFixed(2)})</li>`)
    .join("");

  const emailContent = `To: ${recipient}
Subject: Reservation Request Confirmed - Crate & Key (${code})
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDFBF7; color: #3E362E; margin: 0; padding: 20px; }
    .card { background: #ffffff; border: 1px solid #EBE3D5; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 30px; }
    .header { border-bottom: 2px solid #5A6B5D; padding-bottom: 15px; margin-bottom: 20px; }
    .code { font-size: 22px; font-weight: bold; color: #5A6B5D; letter-spacing: 1px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details-table td { padding: 8px 0; border-bottom: 1px solid #F3EDE2; }
    .footer { margin-top: 30px; font-size: 12px; color: #A08E79; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin:0; color:#3E362E;">Crate & Key Tote Rental</h2>
      <p style="margin:5px 0 0 0; color:#5A6B5D;">Peoria &amp; Washington, IL Local Service</p>
    </div>
    <h3>Reservation Request Received!</h3>
    <p>Hi ${reservation.fullName || "Customer"},</p>
    <p>Thank you for choosing Crate & Key for your upcoming move. We have received your reservation request and hold on inventory.</p>
    
    <div style="background:#F5F2ED; padding:15px; border-radius:8px; margin:20px 0;">
      <span style="font-size:12px; text-transform:uppercase; color:#7E6E5C; font-weight:bold;">Confirmation Code</span><br/>
      <span class="code">${code}</span>
    </div>

    <h4>Delivery Summary:</h4>
    <table class="details-table">
      <tr><td><strong>Delivery Date:</strong></td><td>${reservation.deliveryDate}</td></tr>
      <tr><td><strong>Pickup Date:</strong></td><td>${reservation.pickupDate}</td></tr>
      <tr><td><strong>Address:</strong></td><td>${reservation.streetAddress}, ${reservation.city}, IL ${reservation.zipCode}</td></tr>
      <tr><td><strong>Estimated Total:</strong></td><td>$${(reservation.pricing?.totalPrice || 0).toFixed(2)}</td></tr>
    </table>

    <h4>Reserved Items:</h4>
    <ul>
      ${itemsList}
    </ul>

    <p style="margin-top:20px;">Our local team will review tote availability for your dates and email you invoice &amp; payment instructions. No charge is made until you approve the payment link!</p>

    <div class="footer">
      <p>Crate & Key • Washington, IL 61571 • hello@crateandkey.com</p>
    </div>
  </div>
</body>
</html>`;

  const rawBase64 = utf8ToBase64Url(emailContent);

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
    throw new Error(`Failed to send confirmation email via Gmail: ${errText}`);
  }

  return await sendRes.json();
};
