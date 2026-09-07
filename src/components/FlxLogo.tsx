import React from 'react';

interface FlxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'icon';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FlxLogo: React.FC<FlxLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick
}) => {
  // Height & scale configuration
  const scale = size === 'sm' ? 'scale-75 origin-left' : size === 'lg' ? 'scale-110' : size === 'icon' ? 'scale-50' : 'scale-90 md:scale-100';

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`flex items-center gap-1.5 transition-transform duration-200 ${scale}`}>
        {/* Render SVG Logo with brushed titanium & ruby metallic chrome */}
        <svg
          viewBox="0 0 420 160"
          className={size === 'sm' ? 'h-10 w-auto' : size === 'lg' ? 'h-24 w-auto' : size === 'icon' ? 'h-8 w-auto' : 'h-14 w-auto'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark Metallic Chrome for FL */}
            <linearGradient id="metalDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a4f58" />
              <stop offset="35%" stopColor="#1a1c20" />
              <stop offset="50%" stopColor="#2e3239" />
              <stop offset="75%" stopColor="#111215" />
              <stop offset="100%" stopColor="#08080a" />
            </linearGradient>

            {/* Bevel Highlights for Metal */}
            <linearGradient id="bevelLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#8d95a5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#101216" stopOpacity="0.9" />
            </linearGradient>

            {/* Ruby Red Chrome for X and Swoosh */}
            <linearGradient id="rubyChrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d58" />
              <stop offset="25%" stopColor="#e50914" />
              <stop offset="60%" stopColor="#a3020c" />
              <stop offset="85%" stopColor="#600006" />
              <stop offset="100%" stopColor="#ff2e3a" />
            </linearGradient>

            {/* Vibrant Red Glow Filter */}
            <filter id="redShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#e50914" floodOpacity="0.45" />
            </filter>

            {/* Heavy 3D Drop Shadow */}
            <filter id="deep3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Top Carbon Arch */}
          <path
            d="M 180 32 Q 260 14 340 38 Q 260 26 180 32 Z"
            fill="url(#metalDark)"
            stroke="#666"
            strokeWidth="0.8"
            filter="url(#deep3d)"
          />

          {/* Letter 'F' */}
          <g filter="url(#deep3d)">
            <path
              d="M 40 28 L 155 28 L 145 52 L 80 52 L 76 74 L 132 74 L 123 96 L 72 96 L 62 134 L 20 134 Z"
              fill="url(#metalDark)"
              stroke="#6b7280"
              strokeWidth="1.5"
            />
            {/* Top highlight facet */}
            <path
              d="M 40 28 L 155 28 L 148 38 L 48 38 Z"
              fill="#ffffff"
              fillOpacity="0.35"
            />
          </g>

          {/* Letter 'L' */}
          <g filter="url(#deep3d)">
            <path
              d="M 175 28 L 216 28 L 194 98 L 260 98 L 252 124 L 165 124 Z"
              fill="url(#metalDark)"
              stroke="#6b7280"
              strokeWidth="1.5"
            />
            {/* Top facet */}
            <path
              d="M 175 28 L 216 28 L 210 37 L 180 37 Z"
              fill="#ffffff"
              fillOpacity="0.35"
            />
          </g>

          {/* Red Swoosh Under 'FL' flowing into 'X' */}
          <path
            d="M 12 144 Q 90 120 170 124 Q 240 126 270 110 Q 220 138 12 152 Z"
            fill="url(#rubyChrome)"
            filter="url(#redShadow)"
          />
          <path
            d="M 30 142 Q 130 118 250 114"
            stroke="#ff9aa2"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Letter 'X' in 3D Metallic Ruby Chrome */}
          <g filter="url(#deep3d)">
            {/* Main Diagonal 1 */}
            <path
              d="M 250 42 L 292 42 L 390 134 L 350 134 Z"
              fill="url(#rubyChrome)"
              stroke="#ff4d58"
              strokeWidth="1.2"
            />
            {/* Main Diagonal 2 */}
            <path
              d="M 388 42 L 350 42 L 280 102 L 312 134 L 340 108 L 388 42 Z"
              fill="url(#rubyChrome)"
              stroke="#ff4d58"
              strokeWidth="1.2"
            />
            {/* Bevel Glint on X */}
            <path
              d="M 252 43 L 290 43 L 278 54 L 246 54 Z"
              fill="#ffffff"
              fillOpacity="0.45"
            />
          </g>
        </svg>

        {/* Text Portion: REAL ESTATE */}
        {size !== 'icon' && (
          <div className="flex min-w-0 flex-col justify-center -ml-1">
            <div className="flex items-baseline tracking-widest leading-none">
              <span className="whitespace-nowrap font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 text-xl md:text-2xl tracking-[0.25em] drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                REAL ESTATE
              </span>
            </div>

            {/* Separator Line with Center Ruby Node */}
            <div className="flex items-center gap-1.5 my-1">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-red-600 to-red-500" />
              <div className="w-1.5 h-1.5 bg-red-600 shadow-[0_0_8px_#dc2626]" />
              <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-red-600 to-red-500" />
            </div>

            {/* Tagline: FIND • INVEST • LIVE BETTER. */}
            {showTagline && (
              <div className="flex items-center justify-between text-[8px] md:text-[9.5px] font-black uppercase tracking-[0.3em] text-zinc-400">
                <span className="text-white hover:text-red-500 transition-colors">FIND</span>
                <span className="text-red-600 text-[10px] leading-none font-black">•</span>
                <span className="text-white hover:text-red-500 transition-colors">INVEST</span>
                <span className="text-red-600 text-[10px] leading-none font-black">•</span>
                <span className="text-white hover:text-red-500 transition-colors">LIVE BETTER</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
