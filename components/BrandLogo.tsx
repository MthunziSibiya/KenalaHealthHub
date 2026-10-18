import React from "react";

interface BrandLogoProps {
  variant?: "full" | "icon-only" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ variant = "full", className = "", size = "md" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const subSizes = {
    sm: "text-[9px] tracking-widest",
    md: "text-xs tracking-[0.25em]",
    lg: "text-sm tracking-[0.3em]",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Heart + Cross Mark */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crimson Heart Outline with Soft Glow */}
          <path
            d="M50 88C50 88 12 62 12 34C12 20 23 10 37 10C44.5 10 49.5 14 50 17C50.5 14 55.5 10 63 10C77 10 88 20 88 34C88 62 50 88 50 88Z"
            fill="#B81D24"
          />
          {/* Inner Medical Cross */}
          <path
            d="M45 28H55V44H71V54H55V70H45V54H29V44H45V28Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {variant !== "icon-only" && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight text-[#B81D24] ${titleSizes[size]}`}>
              Kenala
            </span>
            <span className={`font-black tracking-wide text-zinc-900 ${titleSizes[size]}`}>
              <span className="text-[#B81D24] mx-1">—</span>HEALTH HUB<span className="text-[#B81D24] mx-1">—</span>
            </span>
          </div>
          <span className={`font-bold uppercase text-zinc-600 mt-1 ${subSizes[size]}`}>
            CARE • COMPASSION • COMMUNITY
          </span>
        </div>
      )}
    </div>
  );
}

export function EcgPulseLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 240 40"
        className="w-48 h-8 text-[#B81D24] animate-ecg-pulse"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 20 H50 L58 10 L66 30 L74 6 L82 34 L90 20 H105 L112 12 C115 8 120 8 123 12 L125 15 L127 12 C130 8 135 8 138 12 L145 20 H160 L168 8 L176 32 L184 14 L192 26 L198 20 H240" />
      </svg>
      <div className="flex flex-col">
        <span className="font-serif italic text-sm text-zinc-700 leading-tight">Your health,</span>
        <span className="font-black text-xs tracking-wider text-[#B81D24] uppercase leading-tight">
          OUR PRIORITY.
        </span>
      </div>
    </div>
  );
}
