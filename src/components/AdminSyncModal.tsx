import React, { useState, useEffect } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Lock,
  LogOut,
  UserCheck,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import {
  googleSignIn,
  googleLogout,
  initAuth,
  syncAllReservationsToGoogleSheet,
} from "../lib/googleWorkspace";
import { User } from "firebase/auth";

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [reservationsCount, setReservationsCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset auth state when modal opens
    setPasscode("");
    setAuthError(null);

    // If already authenticated, fetch reservation count
    if (isAuthenticated) {
      fetchReservations(passcode);
    }
  }, [isOpen]);

  const fetchReservations = async (key: string) => {
    try {
      const res = await fetch(`/api/reservations?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        setReservationsCount(data.count || 0);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setIsAuthenticated(false);
        setAuthError("Invalid Owner Passcode. Please try again.");
      }
    } catch {
      setAuthError("Unable to verify credentials with server.");
    }
  };

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    // Init Auth Listener for Google Workspace
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setGoogleToken(token);
      },
      () => {
        setCurrentUser(null);
        setGoogleToken(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Please enter your Owner Passcode.");
      return;
    }
    fetchReservations(passcode.trim());
  };

  const handleConnect = async () => {
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setGoogleToken(res.accessToken);
        setSyncStatus("Connected to Google Workspace!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in with Google.");
    }
  };

  const handleDisconnect = async () => {
    await googleLogout();
    setCurrentUser(null);
    setGoogleToken(null);
    setSyncStatus(null);
    setSheetUrl(null);
  };

  const handleSyncSheets = async () => {
    if (!googleToken) {
      setErrorMsg("Please connect your Google account first.");
      return;
    }

    setIsSyncing(true);
    setErrorMsg(null);
    setSyncStatus("Syncing reservations to Google Sheets...");

    try {
      const result = await syncAllReservationsToGoogleSheet(googleToken, passcode);
      setSheetUrl(result.spreadsheetUrl);
      setSyncStatus(
        `Successfully synced ${result.count} reservation(s) to Google Sheets!`
      );
    } catch (err: any) {
      console.error("Sheets sync error:", err);
      setErrorMsg(err.message || "Failed to sync to Google Sheets.");
      setSyncStatus(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadCSV = () => {
    window.open(`/api/reservations/csv?key=${encodeURIComponent(passcode)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE3D5] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A6B5D]/10 text-[#5A6B5D] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2A26]">
                Owner Portal
              </h3>
              <p className="text-xs text-[#8C7A6B]">
                Restricted Crate &amp; Key Administration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C7A6B] hover:text-[#2D2A26] hover:bg-[#F5F2ED] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Prompt */}
        {!isAuthenticated ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4 py-2">
            <div className="bg-[#F5F2ED] p-4 rounded-xl border border-[#EBE3D5] text-center space-y-2">
              <KeyRound className="w-8 h-8 text-[#5A6B5D] mx-auto" />
              <h4 className="font-serif font-bold text-base text-[#2D2A26]">
                Passcode Required
              </h4>
              <p className="text-xs text-[#5E5449] max-w-xs mx-auto">
                This area is password protected for Crate &amp; Key owners only.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2A26] mb-1.5 uppercase tracking-wider">
                Owner Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner passcode..."
                className="w-full px-4 py-3 rounded-xl border border-[#D5C9B8] bg-white text-sm text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#F5F2ED] text-[#2D2A26] text-xs font-bold hover:bg-[#E5DCCF] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#5A6B5D] hover:bg-[#4A594D] text-white text-xs font-bold transition shadow-xs"
              >
                Unlock Portal
              </button>
            </div>
          </form>
        ) : (
          /* Authenticated Admin Controls */
          <div>
            {/* Stats banner */}
            <div className="bg-[#F5F2ED] rounded-xl p-4 mb-5 flex items-center justify-between border border-[#EBE3D5]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7E6E5C]">
                  Total Stored Requests
                </span>
                <p className="text-2xl font-extrabold text-[#5A6B5D]">
                  {reservationsCount} Reservations
                </p>
              </div>
              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 rounded-lg bg-[#2D2A26] hover:bg-[#3E362E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>

            {/* Google Workspace Connection Card */}
            <div className="bg-white rounded-xl p-5 border border-[#EBE3D5] shadow-xs mb-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#2D2A26] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#5A6B5D]" />
                  Google Sheets Integration
                </h4>
                {currentUser && (
                  <span className="text-[11px] font-bold text-[#2e7d32] bg-[#EBF3EC] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-[#5E5449] mb-4 leading-relaxed">
                Connect your Google account (<strong>crateandkeyrentals@gmail.com</strong>) to sync reservations to Google Drive.
              </p>

              {currentUser ? (
                <div className="space-y-3">
                  <div className="text-xs text-[#5E5449] bg-[#F5F2ED] p-2.5 rounded-lg flex items-center justify-between border border-[#EBE3D5]">
                    <span>Logged in as <strong>{currentUser.email}</strong></span>
                    <button
                      onClick={handleDisconnect}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>

                  <button
                    onClick={handleSyncSheets}
                    disabled={isSyncing}
                    className="w-full py-3 px-4 rounded-xl bg-[#5A6B5D] hover:bg-[#4A594D] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing to Google Sheets..." : "Sync All Requests to Google Sheets"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F5F2ED] text-[#2D2A26] border border-[#D5C9B8] text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Sign in with Google Workspace
                </button>
              )}

              {/* Status Message */}
              {syncStatus && (
                <div className="mt-3 p-3 rounded-lg bg-[#EBF3EC] border border-[#A8C7AD] text-xs text-[#2e7d32] font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{syncStatus}</div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Direct Google Sheet Link */}
              {sheetUrl && (
                <div className="mt-3 pt-3 border-t border-[#EBE3D5]">
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#5A6B5D]/10 hover:bg-[#5A6B5D]/20 text-[#5A6B5D] text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>Open Google Sheet in Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-[#EBE3D5] pt-4">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-[#8C7A6B] hover:text-[#2D2A26] font-medium underline"
              >
                Lock Session
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#F5F2ED] hover:bg-[#E5DCCF] text-[#2D2A26] font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
