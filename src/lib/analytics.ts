// Google Analytics 4 (GA4) integration utility for Crate & Key

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    GA_MEASUREMENT_ID?: string;
  }
}

// Get Measurement ID from Vite env variable (VITE_GA_MEASUREMENT_ID) or window override
export const getGaMeasurementId = (): string => {
  if (typeof window !== "undefined" && window.GA_MEASUREMENT_ID) {
    return window.GA_MEASUREMENT_ID;
  }
  return import.meta.env.VITE_GA_MEASUREMENT_ID || "G-6N6JBCQNPV";
};

let isGaInitialized = false;

/**
 * Initializes Google Analytics gtag.js script if a measurement ID is configured.
 */
export function initGA(): void {
  if (typeof window === "undefined" || isGaInitialized) return;

  const gaId = getGaMeasurementId();

  if (!gaId) {
    console.log(
      "[Google Analytics] No VITE_GA_MEASUREMENT_ID set in environment. Events will be logged to console in dev mode."
    );
    return;
  }

  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      function gtag(...args: any[]) {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;
    }

    // Check if script tag is already present in document.head
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.gtag("js", new Date());
      window.gtag("config", gaId, {
        send_page_view: true,
        cookie_flags: "SameSite=None;Secure",
      });
    }

    isGaInitialized = true;
    console.log(`[Google Analytics] Initialized with ID: ${gaId}`);
  } catch (err) {
    console.error("[Google Analytics] Failed to initialize:", err);
  }
}

/**
 * Track a page view or virtual view in single-page navigation
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  const gaId = getGaMeasurementId();
  if (typeof window !== "undefined" && window.gtag && gaId) {
    window.gtag("config", gaId, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  } else {
    console.log(`[GA PageView] ${pagePath} (${pageTitle || document.title})`);
  }
}

/**
 * Track custom events (e.g. add_to_cart, begin_checkout, reservation_submitted)
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  } else {
    console.log(`[GA Event] ${eventName}`, params);
  }
}
