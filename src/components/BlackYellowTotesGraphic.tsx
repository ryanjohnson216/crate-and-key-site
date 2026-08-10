import React from "react";

export const BlackYellowTotesGraphic: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px] bg-[#2A2421] flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="truckWall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A302A" />
            <stop offset="50%" stopColor="#4A3E36" />
            <stop offset="100%" stopColor="#2E2520" />
          </linearGradient>

          <linearGradient id="woodSlat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C68B59" />
            <stop offset="50%" stopColor="#B37847" />
            <stop offset="100%" stopColor="#9C6436" />
          </linearGradient>

          <linearGradient id="truckFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A4E51" />
            <stop offset="100%" stopColor="#2A2D30" />
          </linearGradient>

          <linearGradient id="yellowLid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE033" />
            <stop offset="60%" stopColor="#FFC700" />
            <stop offset="100%" stopColor="#E6B200" />
          </linearGradient>

          <linearGradient id="yellowLidSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E6B200" />
            <stop offset="100%" stopColor="#B38A00" />
          </linearGradient>

          <linearGradient id="blackToteBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="40%" stopColor="#222222" />
            <stop offset="100%" stopColor="#141414" />
          </linearGradient>

          <linearGradient id="blackToteSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>

          <linearGradient id="greenStrap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B7D6E" />
            <stop offset="50%" stopColor="#5A6B5D" />
            <stop offset="100%" stopColor="#435245" />
          </linearGradient>

          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* --- TRUCK INTERIOR BACKGROUND --- */}
        {/* Wall */}
        <rect x="0" y="0" width="800" height="460" fill="url(#truckWall)" />

        {/* Wooden Slat Rails (U-Haul Truck Interior Wall Style) */}
        <g opacity="0.85">
          <rect x="0" y="60" width="800" height="28" fill="url(#woodSlat)" rx="2" />
          <line x1="0" y1="60" x2="800" y2="60" stroke="#7A4B24" strokeWidth="2" />
          <line x1="0" y1="88" x2="800" y2="88" stroke="#523014" strokeWidth="2" />

          <rect x="0" y="160" width="800" height="28" fill="url(#woodSlat)" rx="2" />
          <line x1="0" y1="160" x2="800" y2="160" stroke="#7A4B24" strokeWidth="2" />
          <line x1="0" y1="188" x2="800" y2="188" stroke="#523014" strokeWidth="2" />

          <rect x="0" y="260" width="800" height="28" fill="url(#woodSlat)" rx="2" />
          <line x1="0" y1="260" x2="800" y2="260" stroke="#7A4B24" strokeWidth="2" />
          <line x1="0" y1="288" x2="800" y2="288" stroke="#523014" strokeWidth="2" />

          <rect x="0" y="360" width="800" height="28" fill="url(#woodSlat)" rx="2" />
          <line x1="0" y1="360" x2="800" y2="360" stroke="#7A4B24" strokeWidth="2" />
          <line x1="0" y1="388" x2="800" y2="388" stroke="#523014" strokeWidth="2" />
        </g>

        {/* Metal Tie-Down Track */}
        <rect x="0" y="210" width="800" height="14" fill="#8C9298" />
        <line x1="0" y1="210" x2="800" y2="210" stroke="#555A5E" strokeWidth="2" />
        <line x1="0" y1="224" x2="800" y2="224" stroke="#33373A" strokeWidth="2" />
        {/* Track Holes */}
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={30 + i * 50} y={214} width={18} height={6} rx={2} fill="#33373A" />
        ))}

        {/* Floor */}
        <rect x="0" y="460" width="800" height="140" fill="url(#truckFloor)" />
        <line x1="0" y1="460" x2="800" y2="460" stroke="#1F2123" strokeWidth="4" />
        {/* Floor Ribs */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 100} y1={460} x2={i * 100 - 40} y2={600} stroke="#222527" strokeWidth="3" />
        ))}

        {/* Truck Wall Ambient Shadow */}
        <rect x="0" y="0" width="800" height="600" fill="black" opacity="0.15" />

        {/* --- STACK 1: LEFT COLUMN (3 Totes High) --- */}
        <g filter="url(#shadow)">
          {/* Tote 1 (Bottom Left) */}
          <g transform="translate(180, 360)">
            {/* Black Body */}
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            {/* Side Ribs / Structure */}
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            {/* Handles */}
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            {/* Lid Structural Grid / Ribs */}
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            {/* Corner Padlock Holes */}
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>

          {/* Tote 2 (Middle Left) */}
          <g transform="translate(180, 245)">
            {/* Black Body */}
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>

          {/* Tote 3 (Top Left) */}
          <g transform="translate(180, 130)">
            {/* Black Body */}
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>

        </g>

        {/* --- STACK 2: RIGHT COLUMN (3 Totes High) --- */}
        <g filter="url(#shadow)">
          {/* Tote 4 (Bottom Right) */}
          <g transform="translate(420, 360)">
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>

          {/* Tote 5 (Middle Right) */}
          <g transform="translate(420, 245)">
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>

          {/* Tote 6 (Top Right) */}
          <g transform="translate(420, 130)">
            <path d="M 10 25 L 200 25 L 192 110 L 18 110 Z" fill="url(#blackToteBody)" />
            <path d="M 28 35 L 182 35 L 176 102 L 34 102 Z" fill="#1A1A1A" stroke="#2B2B2B" strokeWidth="2" />
            <line x1="60" y1="35" x2="56" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="100" y1="35" x2="100" y2="102" stroke="#383838" strokeWidth="2" />
            <line x1="140" y1="35" x2="144" y2="102" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="45" width="40" height="12" rx="4" fill="#0D0D0D" stroke="#333" strokeWidth="1" />
            {/* Yellow Lid */}
            <path d="M 2 0 L 208 0 L 202 26 L 8 26 Z" fill="url(#yellowLid)" />
            <path d="M 0 0 L 210 0 L 210 8 L 0 8 Z" fill="#FFE54D" />
            <line x1="30" y1="8" x2="32" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="70" y1="8" x2="72" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="110" y1="8" x2="110" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="150" y1="8" x2="148" y2="22" stroke="#D4A000" strokeWidth="2" />
            <line x1="180" y1="8" x2="178" y2="22" stroke="#D4A000" strokeWidth="2" />
            <circle cx="12" cy="13" r="3" fill="#1F1F1F" />
            <circle cx="198" cy="13" r="3" fill="#1F1F1F" />
          </g>
        </g>

        {/* --- TIE DOWN RATCHET STRAP ACROSS BOTH STACKS --- */}
        <g opacity="0.95">
          <path d="M 120 220 L 680 220" stroke="url(#greenStrap)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 120 220 L 680 220" stroke="#7E8F80" strokeWidth="2" strokeDasharray="4 4" />
          {/* Ratchet Buckle in Middle */}
          <rect x="388" y="210" width="24" height="20" rx="3" fill="#A8B0B8" stroke="#4A5056" strokeWidth="2" />
          <rect x="394" y="215" width="12" height="10" rx="2" fill="#2D3033" />
        </g>

        {/* --- FRONT LIGHTING GRADIENT OVERLAY --- */}
        <linearGradient id="frontHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
        <rect x="0" y="0" width="800" height="600" fill="url(#frontHighlight)" pointerEvents="none" />
      </svg>
    </div>
  );
};
