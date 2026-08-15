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
 * Helper to detect if current session originates from a postcard QR code or marketing link
 */
export function getCampaignInfo() {
  if (typeof window === "undefined") return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const fullUrl = window.location.href.toLowerCase();

    const utmSource = (params.get("utm_source") || params.get("source") || params.get("ref") || params.get("promo") || "").toLowerCase();
    const utmCampaign = (params.get("utm_campaign") || params.get("campaign") || "").toLowerCase();
    const utmMedium = (params.get("utm_medium") || params.get("medium") || "qr").toLowerCase();

    const isPostcard =
      utmSource === "postcard" ||
      utmSource.includes("postcard") ||
      utmCampaign.includes("postcard") ||
      utmCampaign.includes("pending") ||
      fullUrl.includes("postcard") ||
      fullUrl.includes("ref=postcard") ||
      fullUrl.includes("promo=postcard");

    if (isPostcard) {
      return {
        isPostcard: true,
        source: "postcard",
        medium: utmMedium || "qr",
        campaign: utmCampaign || "postcard_pending_home_sale",
        tag: "Postcard Campaign (Pending Home Sale)",
      };
    }

    if (utmSource || utmCampaign) {
      return {
        isPostcard: false,
        source: utmSource || "campaign",
        medium: utmMedium || "referral",
        campaign: utmCampaign || "general_campaign",
        tag: `Campaign: ${utmSource || "external"}${utmCampaign ? ` (${utmCampaign})` : ""}`,
      };
    }

    // Check stored session from previous navigation
    const storedTag = sessionStorage.getItem("crate_key_campaign");
    if (storedTag && storedTag.includes("Postcard")) {
      return {
        isPostcard: true,
        source: "postcard",
        medium: "qr",
        campaign: "postcard_pending_home_sale",
        tag: storedTag,
      };
    }
  } catch (err) {
    console.warn("Error parsing campaign info:", err);
  }

  return null;
}

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

    const campaign = getCampaignInfo();
    const configParams: Record<string, any> = {
      send_page_view: true,
      cookie_flags: "SameSite=None;Secure",
    };

    if (campaign) {
      configParams.campaign_source = campaign.source;
      configParams.campaign_medium = campaign.medium;
      configParams.campaign_name = campaign.campaign;
    }

    // Check if script tag is already present in document.head
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.gtag("js", new Date());
      window.gtag("config", gaId, configParams);
    }

    if (campaign?.isPostcard) {
      window.gtag("set", "user_properties", {
        traffic_type: "postcard_qr",
        campaign_source: "postcard",
      });
    }

    isGaInitialized = true;
    console.log(`[Google Analytics] Initialized with ID: ${gaId}${campaign ? ` (Campaign: ${campaign.source})` : ""}`);
  } catch (err) {
    console.error("[Google Analytics] Failed to initialize:", err);
  }
}

/**
 * Track a page view or virtual view in single-page navigation
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  const gaId = getGaMeasurementId();
  const campaign = getCampaignInfo();

  if (typeof window !== "undefined" && window.gtag && gaId) {
    const params: Record<string, any> = {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    };

    if (campaign) {
      params.campaign_source = campaign.source;
      params.campaign_medium = campaign.medium;
      params.campaign_name = campaign.campaign;
    }

    window.gtag("config", gaId, params);
  } else {
    console.log(`[GA PageView] ${pagePath} (${pageTitle || document.title})`, campaign);
  }
}

/**
 * Track custom events (e.g. add_to_cart, begin_checkout, reservation_submitted)
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  const campaign = getCampaignInfo();
  const eventParams = {
    ...params,
    ...(campaign ? { campaign_source: campaign.source, campaign_medium: campaign.medium, campaign_name: campaign.campaign } : {}),
  };

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  } else {
    console.log(`[GA Event] ${eventName}`, eventParams);
  }
}
