"use client";

import React from "react";

interface MascotLogoProps {
  variant?: "full" | "icon" | "horizontal" | "app_icon" | "favicon";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light" | "auto";
  className?: string;
  showTagline?: boolean;
}

export const MascotLogo: React.FC<MascotLogoProps> = ({
  variant = "full",
  size = "md",
  theme = "auto",
  className = "",
  showTagline = true,
}) => {
  // Dimension scales
  const sizeMap = {
    sm: { height: 36, iconSize: 32, fontSize: "text-lg", subSize: "text-[9px]" },
    md: { height: 48, iconSize: 44, fontSize: "text-2xl", subSize: "text-[11px]" },
    lg: { height: 64, iconSize: 58, fontSize: "text-3xl", subSize: "text-xs" },
    xl: { height: 84, iconSize: 76, fontSize: "text-4xl", subSize: "text-sm" },
  };

  const currentSize = sizeMap[size];

  // SVG Mascot Artwork
  const MascotIcon = ({ size: iconPx = 48 }: { size?: number }) => (
    <svg
      width={iconPx}
      height={iconPx}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      {/* Taegeuk Brush Strokes Background */}
      <path
        d="M20 45 C 10 15, 60 5, 95 25 C 75 18, 30 22, 20 45 Z"
        fill="#EF4444"
        opacity="0.9"
      />
      <path
        d="M25 80 C 15 105, 70 115, 100 95 C 75 105, 35 100, 25 80 Z"
        fill="#2563EB"
        opacity="0.9"
      />

      {/* Cute White Character Body / Face */}
      <ellipse cx="60" cy="65" rx="36" ry="34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
      
      {/* Pink Blushing Cheeks */}
      <circle cx="38" cy="68" r="6" fill="#F472B6" opacity="0.75" />
      <circle cx="82" cy="68" r="6" fill="#F472B6" opacity="0.75" />

      {/* Eyes: Left Eye Open/Twinkle, Right Eye Winking */}
      <circle cx="44" cy="58" r="4.5" fill="#0F172A" />
      <circle cx="46" cy="56" r="1.5" fill="#FFFFFF" />
      
      {/* Winking right eye */}
      <path
        d="M74 58 Q 78 52 82 58"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cute Smile */}
      <path
        d="M57 66 Q 60 70 63 66"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Korean Traditional Gat (갓) Hat */}
      <g>
        {/* Hat Crown / Cylinder */}
        <path
          d="M40 38 L44 14 Q 60 11 76 14 L80 38 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Hat Rim / Brim */}
        <ellipse
          cx="60"
          cy="38"
          rx="44"
          ry="11"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="2"
        />
        {/* Taegeuk Badge on Hat Crown */}
        <circle cx="60" cy="24" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
        <path d="M 60 18 A 6 6 0 0 1 60 30 A 3 3 0 0 1 60 24 A 3 3 0 0 0 60 18" fill="#EF4444" />
        <path d="M 60 30 A 6 6 0 0 1 60 18 A 3 3 0 0 1 60 24 A 3 3 0 0 0 60 30" fill="#2563EB" />
      </g>

      {/* Blue Open Book in Hands */}
      <g transform="translate(0, 5)">
        {/* Left Book Page */}
        <path
          d="M 60 78 L 30 72 Q 26 92 34 100 L 60 92 Z"
          fill="#2563EB"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Right Book Page */}
        <path
          d="M 60 78 L 90 72 Q 94 92 86 100 L 60 92 Z"
          fill="#3B82F6"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Book spine line */}
        <line x1="60" y1="78" x2="60" y2="93" stroke="#0F172A" strokeWidth="3" />
        {/* Korean "한국어" Text on Book */}
        <text
          x="75"
          y="88"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
          transform="rotate(8 75 88)"
        >
          한국어
        </text>
      </g>
    </svg>
  );

  // Favicon Taegeuk SVG
  if (variant === "favicon") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <path d="M 16 1 A 15 15 0 0 1 16 31 A 7.5 7.5 0 0 1 16 16 A 7.5 7.5 0 0 0 16 1" fill="#EF4444" />
        <path d="M 16 31 A 15 15 0 0 1 16 1 A 7.5 7.5 0 0 1 16 16 A 7.5 7.5 0 0 0 16 31" fill="#2563EB" />
      </svg>
    );
  }

  // App Icon (Rounded square with Seoul skyline backdrop)
  if (variant === "app_icon") {
    return (
      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-400 p-2 flex items-center justify-center shadow-xl overflow-hidden border border-white/20">
        <div className="absolute -bottom-2 -right-2 text-3xl opacity-20 select-none">🌸</div>
        <div className="absolute top-1 right-2 w-1.5 h-6 bg-white/40 rounded-full blur-[0.5px]" />
        <MascotIcon size={64} />
      </div>
    );
  }

  // Icon only
  if (variant === "icon") {
    return <MascotIcon size={currentSize.iconSize} />;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <MascotIcon size={currentSize.iconSize} />

      <div className="flex flex-col">
        <div className="flex items-baseline">
          {/* TOPIK bold heavy text */}
          <span
            className={`font-black tracking-tight ${currentSize.fontSize} text-white`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            TOPIK
          </span>

          {/* Path cursive styled with Pagoda Roof */}
          <span className="relative inline-flex items-baseline ml-1.5">
            {/* Pagoda roof icon above Path */}
            <svg
              className="absolute -top-3.5 right-1 w-4 h-3 text-indigo-400"
              viewBox="0 0 24 16"
              fill="currentColor"
            >
              <path d="M12 0 L16 4 L22 6 Q16 7 14 10 L10 10 Q8 7 2 6 L8 4 Z" />
              <path d="M10 10 L14 10 L15 16 L9 16 Z" opacity="0.8" />
            </svg>
            <span
              className={`font-extrabold italic tracking-tight ${currentSize.fontSize} bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent`}
              style={{
                fontFamily: "'Segoe Script', 'Brush Script MT', 'Outfit', cursive, sans-serif",
                textShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
              }}
            >
              Path
            </span>
          </span>
        </div>

        {/* STUDY • PRACTICE • MASTER Subtitle */}
        {showTagline && (
          <div
            className={`font-bold tracking-[0.25em] uppercase text-slate-400 ${currentSize.subSize} flex items-center gap-1.5`}
          >
            <span>STUDY</span>
            <span className="text-indigo-400 text-[8px]">•</span>
            <span>PRACTICE</span>
            <span className="text-indigo-400 text-[8px]">•</span>
            <span>MASTER</span>
          </div>
        )}
      </div>
    </div>
  );
};
