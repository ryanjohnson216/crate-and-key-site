import { TotePackage, AddOnItem } from "../types";

// $4/tote for default 2-week rental (easily editable configuration)
export const BASE_TOTE_RATE_2WEEKS = 4;
export const EXTRA_WEEK_RATE_PER_TOTE = 1.50; // $1.50 per tote for each extra week
export const DOLLY_INCLUDED_VALUE = 15;

export const TOTE_PACKAGES: TotePackage[] = [
  {
    id: "pkg-studio",
    name: "The Starter Pack",
    homeSize: "Studio to 1 Bed",
    toteCount: 25,
    dolliesIncluded: 0,
    basePrice2Weeks: 25 * BASE_TOTE_RATE_2WEEKS, // $100
    popular: false,
    description: "Ideal for apartments and minimalist moves. Stackable, heavy-duty totes delivered ready to pack.",
    includes: [
      "25 Heavy-Duty Reusable Moving Totes with Lids",
      "Full 2-Week Rental Period",
      "Removable and Customizable Labels & Marker"
    ],
    dimensionsInfo: "Each tote is 27\" L x 17\" W x 12\" H (2.3 cu. ft.)"
  },
  {
    id: "pkg-2-3bed",
    name: "The Standard Move",
    homeSize: "2 - 3 Bedrooms",
    toteCount: 45,
    dolliesIncluded: 0,
    basePrice2Weeks: 45 * BASE_TOTE_RATE_2WEEKS, // $180
    popular: true,
    description: "Our most requested package for medium-sized homes and townhouses. Perfect for 3-4 person households.",
    includes: [
      "45 Heavy-Duty Reusable Moving Totes with Lids",
      "Full 2-Week Rental Period",
      "Removable and Customizable Labels & Marker"
    ],
    dimensionsInfo: "Replaces approx 60 single-use cardboard boxes"
  },
  {
    id: "pkg-4bed-plus",
    name: "The Family Bundle",
    homeSize: "4+ Bedrooms & Large Houses",
    toteCount: 70,
    dolliesIncluded: 0,
    basePrice2Weeks: 70 * BASE_TOTE_RATE_2WEEKS, // $280
    popular: false,
    description: "Designed for spacious family homes with garages, basements, and closets.",
    includes: [
      "70 Heavy-Duty Reusable Moving Totes with Lids",
      "Full 2-Week Rental Period",
      "Removable and Customizable Labels & Marker"
    ],
    dimensionsInfo: "Replaces approx 90-100 single-use cardboard boxes"
  }
];

export const ADD_ON_ITEMS: AddOnItem[] = [
  {
    id: "addon-dolly",
    name: "Heavy-Duty Tote Dolly",
    shortName: "Dolly",
    price: 15,
    unit: "per rental",
    description: "Heavy-duty 4-wheel dolly. Roll up to 600 lbs effortlessly without lifting.",
    category: "equipment",
    iconName: "Truck"
  },
  {
    id: "addon-garment-bag",
    name: "Hanging Garment Bags (Set of 2)",
    shortName: "Garment Bags",
    price: 12,
    unit: "set of 2",
    description: "Heavy-duty fabric wardrobe bags designed to keep suits, dresses, and hanging clothes protected directly on hangers.",
    category: "supplies",
    iconName: "Shirt"
  },
  {
    id: "addon-moving-bag",
    name: "Heavy-Duty Zippered Moving Bags (Set of 2)",
    shortName: "Moving Bags",
    price: 12,
    unit: "set of 2",
    description: "Heavy duty zippered moving bags for clothes, bedding, blankets, and linens.",
    category: "supplies",
    iconName: "Package"
  },
  {
    id: "addon-blankets",
    name: "Heavy-Duty Moving Blankets (Set of 4)",
    shortName: "Blankets",
    price: 16,
    unit: "set of 4",
    description: "Thick padded cotton/polyester furniture pads to protect TVs, mirrors, wood tables, and appliances during transport.",
    category: "equipment",
    iconName: "Shield"
  },
  {
    id: "addon-tape-gun",
    name: "Industrial Tape Gun & Roll",
    shortName: "Tape Gun",
    price: 10,
    unit: "per set",
    description: "Ergonomic tape dispenser + 110 yards of heavy-duty packing tape for any extra non-tote items or furniture wrapping.",
    category: "supplies",
    iconName: "Scissors"
  },
  {
    id: "addon-movein-kit",
    name: "Move-In Day Essential Kit",
    shortName: "Essentials Kit",
    price: 24,
    unit: "per kit",
    description: "Everything you need on unpacking day:",
    kitItems: [
      "Utility knife",
      "Tape measure",
      "Scissors",
      "Surface wipes",
      "Pens & notepad",
      "Paper towels",
      "Screwdriver",
      "Trash bags"
    ],
    category: "kits",
    iconName: "Wrench"
  }
];

export const WHY_REUSABLE_BENEFITS = [
  {
    title: "Crushproof Durability",
    description: "Made of industrial-grade polyethylene plastic. Won't collapse, tear, or burst at the bottom when carrying books, kitchenware, or heavy gear.",
    icon: "ShieldCheck",
    tag: "No Crushed Items"
  },
  {
    title: "Zero Box Assembly",
    description: "Totes arrive pre-assembled with attached interlocking lids. Skip hours of folding cardboard, taping seams, or hunting for lost tape rolls.",
    icon: "PackageCheck",
    tag: "Ready Out of the Stack"
  },
  {
    title: "Doorstep Delivery Available",
    description: "We can deliver stacked totes right to your door or garage before move day, then pick them up empty when you're done.",
    icon: "Truck",
    tag: "Flexible Pickup"
  },
  {
    title: "Saves Money vs. Cardboard",
    description: "Buying single-use boxes, tape, and bubble wrap costs $200–$400 for a average move. Renting totes includes lids & dollies for a fraction of the cost.",
    icon: "PiggyBank",
    tag: "Smart Cost Framing"
  },
  {
    title: "Zero Waste Move",
    description: "Each tote is reused over 400 times, eliminating hundreds of pounds of cardboard waste and tape pollution per move.",
    icon: "Leaf",
    tag: "Eco-Friendly Choice"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Choose Your Package & Rental Dates",
    description: "Pick your preferred rental date. We recommend beginning your rental 5-7 days before your move."
  },
  {
    step: "2",
    title: "We Drop Off Clean, Stacked Totes",
    description: "We deliver your tote rental package directly to your door or garage in Central Illinois"
  },
  {
    step: "3",
    title: "Pack, Move & Unpack at Your Pace",
    description: "Pack quickly with interlocking lids, roll totes on our dollies, and move into your new home. Enjoy a standard 2-week rental period to unpack comfortably."
  },
  {
    step: "4",
    title: "We Pick Up Empty Totes",
    description: "Stack the empty totes back up. On your return date, we retrieve them from your porch or driveway. Need extra time? Easily add extra weeks for just $20/wk."
  }
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How many totes do I need for my move?",
    answer: "Most 1-bedroom apartments need ~25 totes, 2-3 bedroom homes need ~45 totes, and 4+ bedroom houses need 70+ totes. Try our quick 1-minute Tote Calculator Quiz to get a personalized recommendation based on your home size and packing style!",
    hasQuizLink: true
  },
  {
    id: "faq-2",
    question: "What is the standard rental period, and what if I need more time?",
    answer: "Our default rental period is 2 full weeks (14 days), which gives you plenty of time to pack before move day and unpack afterward. If you need extra time, you can extend your rental for $20/week or $3/day. Just send us a quick text or email before your pickup date!"
  },
  {
    id: "faq-3",
    question: "What is your delivery and pickup service area?",
    answer: "We proudly serve the entire Central Illinois region — including Washington, Peoria, East Peoria, Pekin, Morton, Dunlap, Metamora, Chillicothe, Canton, Galesburg, Bloomington, Normal, and Lincoln."
  },
  {
    id: "faq-4",
    question: "Are totes sanitized and cleaned between rentals?",
    answer: "Absolutely. Every single tote and dolly undergoes a thorough 2-step process between rentals: pressure washed with eco-friendly cleaning agents and disinfected with non-toxic sanitizer. They arrive spotless and ready for your clothes and kitchenware."
  },
  {
    id: "faq-5",
    question: "Do I need to be home for delivery and pickup?",
    answer: "Nope! As long as you specify a safe, covered location (such as a front porch, covered entryway, or garage), our delivery team can drop off or collect totes without you having to take time off work."
  },
  {
    id: "faq-6",
    question: "What is your policy on damaged or lost totes?",
    answer: "Normal wear and tear (minor scuffs, label residue) is expected and 100% covered. In the rare event a tote is structurally destroyed or lost, the replacement fee is $15 per tote."
  },
  {
    id: "faq-7",
    question: "How far ahead should I reserve my totes?",
    answer: "We recommend reserving at least 7 days in advance to secure your ideal delivery date, especially during peak moving weekends (end of the month). However, we frequently accommodate next-day or same-week reservations!"
  },
  {
    id: "faq-8",
    question: "What is included with my tote package vs. optional add-ons?",
    answer: "Every package includes heavy-duty plastic totes with attached lids, removable customizable labels, and a marker. Optional add-ons include wheeled dollies, garment bags, zippered moving bags, moving blankets, tape guns, and Move-In Day essential kits."
  },
  {
    id: "faq-9",
    question: "Is there a security deposit or hidden fees?",
    answer: "No security deposit is required! We charge $4 per tote for the standard 2-week rental across Central Illinois with no surprise fees."
  }
];

export const SERVICE_CITIES = [
  "Peoria", "East Peoria", "Pekin", "Morton", "Washington",
  "Dunlap", "Metamora", "Chillicothe", "Canton", "Galesburg",
  "Bloomington", "Normal", "Lincoln", "Eureka", "Tremont"
];
