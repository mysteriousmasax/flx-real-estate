import React, { useMemo, useState } from 'react';
import { Property } from '../types';
import { Play, MapPin, Home, TrendingUp, Maximize2, Volume2, VolumeX } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
  activeType: 'All' | 'Invest' | 'Live';
  className?: string;
}

const DAR_ES_SALAAM = { x: 52, y: 58 };

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetails,
  activeType,
  className = '',
}) => {
  const [mapMode, setMapMode] = useState<'satellite' | 'hybrid' | 'dark'>('satellite');

  const markerPositions = useMemo(
    () =>
      properties.map((property, index) => {
        const x = 22 + (((property.location.lng - 29.2) / (40.6 - 29.2)) * 62);
        const y = 82 - (((property.location.lat + 11.85) / (0.9 - 11.85)) * 54);

        return {
          ...property,
          index,
          x: Math.min(82, Math.max(18, x)),
          y: Math.min(76, Math.max(20, y)),
        };
      }),
    [properties]
  );

  const detailProperty = selectedProperty ?? markerPositions[0] ?? null;

  return (
    <div className={`relative w-full h-full min-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#090b0d] shadow-2xl ${className}`}>
      <div
        className={`absolute inset-0 ${
          mapMode === 'satellite'
            ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(75,85,99,0.50),transparent_30%),linear-gradient(135deg,#0b1014_0%,#101821_40%,#0d1117_100%)]'
            : mapMode === 'hybrid'
              ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.18),transparent_38%),linear-gradient(135deg,#101a14_0%,#0f1418_45%,#090b0d_100%)]'
              : 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.16),transparent_35%),linear-gradient(135deg,#0a0d16_0%,#0f172a_45%,#030712_100%)]'
        }`}
      />

      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2 bg-black/80 px-3 py-2 border border-white/10 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          FLX LOCAL TERRITORY
        </div>

        <div className="flex items-center bg-black/75 border border-white/10 p-1 backdrop-blur-sm">
          {['satellite', 'hybrid', 'dark'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMapMode(mode as 'satellite' | 'hybrid' | 'dark')}
              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] transition-colors ${
                mapMode === mode ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode === 'satellite' ? 'Satellite' : mode === 'hybrid' ? 'Hybrid' : 'Dark'}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 1000 640" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="coastline" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.38)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0.12)" />
          </linearGradient>
        </defs>

        <path
          d="M95 120 C 205 80, 312 92, 410 136 S 640 200, 760 165 S 915 130, 950 190 L 965 515 C 842 540, 714 558, 620 540 S 430 478, 332 514 S 148 548, 72 504 L 86 253 Z"
          fill="rgba(148,163,184,0.06)"
          stroke="rgba(148,163,184,0.24)"
          strokeWidth="2"
        />

        <path
          d="M240 255 C 300 240, 350 250, 435 290 S 530 350, 600 388 S 720 420, 810 392"
          fill="none"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="2"
          strokeDasharray="10 12"
        />

        <circle cx={DAR_ES_SALAAM.x * 10} cy={DAR_ES_SALAAM.y * 6.4} r="60" fill="rgba(239,68,68,0.08)" />
        <circle cx={DAR_ES_SALAAM.x * 10} cy={DAR_ES_SALAAM.y * 6.4} r="14" fill="rgba(239,68,68,0.12)" />

        <g fontSize="18" fill="rgba(255,255,255,0.7)" fontWeight="700" letterSpacing="4">
          <text x="430" y="420">DAR ES SALAAM</text>
          <text x="138" y="280">ARUSHA</text>
          <text x="700" y="220">ZANZIBAR</text>
        </g>

        {markerPositions.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          const isInvest = property.property_type === 'Invest';

          return (
            <g
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="cursor-pointer"
              style={{ transformOrigin: `${property.x}px ${property.y}px` }}
            >
              <circle cx={property.x * 10} cy={property.y * 6.4} r={isSelected ? 18 : 14} fill={isInvest ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.18)'} />
              <circle
                cx={property.x * 10}
                cy={property.y * 6.4}
                r={isSelected ? 10 : 8}
                fill={isInvest ? '#22c55e' : '#ef4444'}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={property.x * 10 + 18}
                y={property.y * 6.4 - 14}
                fill="white"
                fontSize="12"
                fontWeight="700"
              >
                {property.location.city.slice(0, 3).toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {detailProperty && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between gap-3">
          <div className="max-w-sm rounded-2xl border border-white/10 bg-black/80 p-3 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">Focused listing</p>
                <h3 className="mt-1 text-sm font-black text-white">{detailProperty.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenDetails(detailProperty)}
                className="rounded-lg border border-red-500/40 bg-red-600/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-red-300"
              >
                View
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {detailProperty.location.city}
            </div>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-300">
              <span className="font-black text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(detailProperty.price)}</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-emerald-300">
                {detailProperty.property_type}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-black/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-sm">
            <Home className="w-3.5 h-3.5 text-red-500" />
            {properties.length} live assets
          </div>
        </div>
      )}
    </div>
  );
};
