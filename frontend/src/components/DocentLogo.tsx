import React from "react";

export const DocentLogo = ({ size = 28 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="docentGlow" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      
      {/* Document Base Shape */}
      <rect x="6" y="4" width="18" height="24" rx="4" fill="url(#docentGlow)" fillOpacity="0.15" stroke="url(#docentGlow)" strokeWidth="1.5" />
      
      {/* Minimalist Page Fold lines */}
      <line x1="10" y1="10" x2="20" y2="10" stroke="url(#docentGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="10" y1="15" x2="16" y2="15" stroke="url(#docentGlow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      
      {/* Intelligence Spark Node */}
      <path
        d="M22 17C22 20.3137 19.3137 23 16 23M22 17C22 13.6863 19.3137 11 16 11M22 17H27M16 23C12.6863 23 10 20.3137 10 17M16 23V27M10 17C10 13.6863 12.6863 11 16 11M10 17H5M16 11V5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="22" cy="17" r="1.5" fill="#38bdf8" />
    </svg>
  );
};