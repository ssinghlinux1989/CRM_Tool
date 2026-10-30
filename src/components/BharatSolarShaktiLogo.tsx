import React from 'react';

interface BharatSolarShaktiLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BharatSolarShaktiLogo: React.FC<BharatSolarShaktiLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Solar Sunburst & PV Globe Icon */}
      <svg
        viewBox="0 0 140 140"
        className={`${sizeStyles[size]} aspect-square shrink-0 filter drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Radiant Solar Sunburst Rays */}
        <g fill="#F58220">
          {/* Top Ray */}
          <path d="M68 5 L77 34 L60 30 Z" />
          <path d="M102 18 L94 44 L81 37 Z" />
          <path d="M125 46 L104 63 L99 50 Z" />
          <path d="M38 12 L56 36 L43 41 Z" />
          <path d="M14 34 L43 51 L33 59 Z" />
          <path d="M5 68 L36 72 L32 85 Z" />
          <path d="M11 100 L40 91 L44 104 Z" />
          <path d="M34 126 L55 106 L65 116 Z" />
          <path d="M68 135 L76 108 L62 108 Z" />
        </g>

        {/* Yellow/Amber Highlight Edge */}
        <path
          d="M32 30 C12 55 10 92 34 116 C22 96 24 62 42 42 Z"
          fill="#FAB815"
        />

        {/* Blue Solar PV Sphere / Globe */}
        <circle cx="78" cy="74" r="48" fill="#1E2C6A" />

        {/* Solar Cell Grid Lines (Silver/White PV Grid) */}
        <g stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.95">
          {/* Latitudinal Cell Ribs */}
          <path d="M38 52 Q 78 44 118 52" />
          <path d="M32 70 Q 78 62 124 70" />
          <path d="M34 88 Q 78 80 122 88" />
          <path d="M46 106 Q 78 100 110 106" />

          {/* Longitudinal Cell Stringers */}
          <path d="M54 36 Q 48 74 54 112" />
          <path d="M72 30 Q 70 74 72 118" />
          <path d="M90 32 Q 94 74 90 116" />
          <path d="M108 42 Q 114 74 108 106" />
        </g>
      </svg>

      {/* Brand Wordmark: B̄HARAT™ SOLAR SHAKTI */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          {/* Top Line: B̄HARAT™ in Deep Navy */}
          <div className="flex items-center">
            <span
              className="text-[#1A2863] dark:text-[#6882E0] font-black tracking-tight text-base sm:text-lg uppercase"
              style={{
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: '0.04em',
              }}
            >
              <span className="relative">
                <span className="absolute -top-1 left-0 right-0 h-[2px] bg-[#1A2863] dark:bg-[#6882E0]" />
                B
              </span>
              HARAT
            </span>
            <span className="text-[#1A2863] dark:text-[#6882E0] text-[9px] font-bold ml-0.5 -mt-2">
              TM
            </span>
          </div>

          {/* Bottom Line: SOLAR in Orange, SHAKTI in Green */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[#F2711C] font-extrabold text-xs sm:text-sm tracking-wider uppercase"
              style={{ letterSpacing: '0.08em' }}
            >
              SOLAR
            </span>
            <span
              className="text-[#258F3B] font-extrabold text-xs sm:text-sm tracking-wider uppercase"
              style={{ letterSpacing: '0.08em' }}
            >
              SHAKTI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
