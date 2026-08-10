export interface TotePackage {
  id: string;
  name: string;
  homeSize: string;
  toteCount: number;
  dolliesIncluded: number;
  basePrice2Weeks: number; // calculated at $4/tote + included dollies discount
  popular?: boolean;
  description: string;
  includes: string[];
  dimensionsInfo: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  shortName?: string;
  price: number;
  unit: string;
  description: string;
  category: "equipment" | "supplies" | "kits";
  iconName: string;
  kitItems?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  type: "package" | "addon" | "custom";
  quantity: number;
  pricePerUnit: number;
  toteCount?: number;
  details?: string;
}

export interface QuizState {
  homeType: string; // 'studio', '2bed', '4bed', 'house'
  packingStyle: string; // 'minimalist', 'average', 'heavy'
  specialItems: string[]; // 'closet', 'books', 'garage', 'fragile'
}

export interface ReservationDetails {
  confirmationCode?: string;
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  aptSuite?: string;
  city: string;
  zipCode: string;
  deliveryDate: string;
  pickupDate: string;
  rentalWeeks: number;
  dropoffNotes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  isFreeDelivery?: boolean;
  tax: number;
  total: number;
}

export interface ZipValidationResult {
  valid: boolean;
  eligible?: boolean;
  city?: string;
  distanceMiles?: number;
  isFreeDelivery?: boolean;
  deliveryFee?: number;
  message: string;
}

export type BrandTheme = "warm-friendly" | "clean-trustworthy";
