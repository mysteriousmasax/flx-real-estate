import React, { useState, useRef } from 'react';
import { Property } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  MapPin, 
  TrendingUp, 
  Home, 
  Heart, 
  Sparkles,
  Maximize2,
  Calendar,
  DollarSign
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  isSaved?: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSelected = false,
  isSaved = false,
  onToggleSave,
  onSelect,
  onOpenDetails,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isInvest = property.property_type === 'Invest';

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(property)}
      className={`group relative overflow-hidden transition-all duration-300 cursor-pointer rounded-[24px] bg-[#0d1117] border ${
        isSelected
          ? 'border-red-600 shadow-[0_20px_50px_rgba(220,38,38,0.24)]'
          : 'border-white/10 hover:border-white/20 shadow-[0_18px_45px_rgba(0,0,0,0.18)]'
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black rounded-t-[24px]">
        {/* Poster Image */}
        <img
          src={property.thumbnail_url}
          alt={property.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video Element for cinematic preview */}
        <video
          ref={videoRef}
          src={property.video_url}
          poster={property.thumbnail_url}
          muted={isMuted}
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient dark scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {/* Status Type Pill: Invest vs Live */}
            <span
              className={`px-3 py-1 text-[9px] font-black tracking-[0.25em] uppercase backdrop-blur-md border ${
                isInvest
                  ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300'
                  : 'bg-red-950/90 border-red-600/80 text-red-300'
              }`}
            >
              {property.property_type}
            </span>

            {/* Video Resolution indicator */}
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {property.video_resolution || '4K 60FPS'}
            </span>
          </div>

          {/* Action Buttons: Save Wishlist & Mute/Unmute */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {isPlaying && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/80 hover:bg-black text-white border border-white/10 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-500" />}
              </button>
            )}

            <button
              onClick={() => onToggleSave(property.id)}
              className="p-2 bg-black/80 hover:bg-black text-zinc-300 hover:text-red-500 border border-white/10 transition-colors"
              title="Save to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Hint: Video Playing */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          {isPlaying ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-red-600 text-white shadow-lg">
              <Play className="w-2.5 h-2.5 fill-white text-white animate-pulse" />
              Live Tour Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 drop-shadow">
              <MapPin className="w-3 h-3 text-red-600" />
              {property.location.neighborhood || property.location.city}, {property.location.state}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0d1117] to-[#0a0d12] rounded-b-[24px]">
        {/* Title & Asking Price */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-red-600 animate-pulse rounded-full" />
            <span className="text-[9px] uppercase tracking-[0.35em] font-black text-red-500">
              Verified Asset / Geotagged
            </span>
          </div>

          <h3 className="font-headline font-black italic text-xl sm:text-2xl text-white tracking-tighter leading-none group-hover:text-red-500 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {formatCurrency(property.price)}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
              {formatCurrency(Math.round(property.price / property.metadata.sqft))}/SQFT
            </span>
          </div>
        </div>

        {/* Technical Data Specification Dividers */}
        <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Category</span>
            <span className="text-xs font-mono italic text-zinc-200">
              {property.property_type} / {property.metadata.architectural_style || 'Contemporary'}
            </span>
          </div>

          {isInvest ? (
            <>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Cap Rate ROI</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {property.metadata.cap_rate || 8.5}% YIELD
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Projected Rent</span>
                <span className="text-xs font-mono text-zinc-300">
                  ${(property.metadata.projected_monthly_rent || 25000).toLocaleString()}/MO
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Spatial Dimensions</span>
                <span className="text-xs font-mono text-zinc-200">
                  {property.metadata.beds} BEDS • {property.metadata.baths} BATHS • {property.metadata.sqft.toLocaleString()} SQFT
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Coordinates</span>
                <span className="text-xs font-mono text-zinc-400">
                  {property.location.lat.toFixed(4)}° N, {Math.abs(property.location.lng).toFixed(4)}° W
                </span>
              </div>
            </>
          )}
        </div>

        {/* Card Footer: Agent Avatar & Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover border border-zinc-700"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-300 leading-tight uppercase tracking-wider">
                {property.agent.name}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">FLX Partner Desk</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(property);
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white flex items-center gap-2 border border-red-500/60 shadow-[0_10px_24px_rgba(220,38,38,0.28)] transition-all rounded-xl"
          >
            <span>Inspect Tour</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
