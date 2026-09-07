import React, { useState, useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Property } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { 
  Play, 
  ExternalLink, 
  MapPin, 
  Compass, 
  Calendar, 
  Key
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

interface GoogleMapViewProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
  activeType?: 'All' | 'Invest' | 'Live';
  className?: string;
  onSwitchToSatellite?: () => void;
}

// Dar es Salaam coastal luxury & diplomatic corridor
const DEFAULT_CENTER = { lat: -6.7720, lng: 39.2400 };
const DEFAULT_ZOOM = 12;

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetails,
  activeType = 'All',
  className = '',
  onSwitchToSatellite,
}) => {
  const [activeMarkerProperty, setActiveMarkerProperty] = useState<Property | null>(null);
  const [mapTypeId, setMapTypeId] = useState<'hybrid' | 'satellite' | 'roadmap' | 'terrain'>('hybrid');
  const { schedulePropertyTour, sendPropertyBrochure } = useWorkspace();
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Catch Google Maps API auth failures if key is invalid
  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps authentication failure detected; activating satellite backup.');
      setLoadError('Google Maps API key authentication error');
    };
  }, []);

  // Format currency
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price.toLocaleString()}`;
  };

  const handleMarkerClick = useCallback(
    (property: Property) => {
      setActiveMarkerProperty(property);
      onSelectProperty(property);
    },
    [onSelectProperty]
  );

  const handleQuickSchedule = async (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
    const res = await schedulePropertyTour(
      prop,
      'VIP Buyer',
      'mysteriousmasax@gmail.com',
      tomorrow,
      'Scheduled directly via Google Maps Property Marker'
    );
    if (res.success) {
      setActionNotice(`Tour scheduled in Google Calendar!`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleQuickEmail = async (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    const res = await sendPropertyBrochure(
      prop,
      'mysteriousmasax@gmail.com',
      'Inquiry initiated from FLX Google Maps Explorer.'
    );
    if (res.success) {
      setActionNotice(`Brochure dispatched via Gmail!`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // Google Maps API Key: accepts custom key from env or runs seamlessly
  const apiKey = (((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '').trim();

  // If no API key is provided, or if loading threw an error, render InteractiveMap with Google Maps Platform setup ribbon
  if (!apiKey || loadError) {
    return (
      <div className={`relative w-full h-full min-h-[500px] flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-black shadow-2xl ${className}`}>
        {/* Top Google Maps Platform Status Ribbon */}
        <div className="bg-[#0e1015]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              Google Maps Platform
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
              Vector Layer Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
            >
              <Key className="w-3 h-3" /> Get Free Demo Key <ExternalLink className="w-3 h-3" />
            </a>
            {onSwitchToSatellite && (
              <button
                onClick={onSwitchToSatellite}
                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Switch to Satellite Radar
              </button>
            )}
          </div>
        </div>

        {/* Embedded Interactive Radar Map View */}
        <div className="flex-1 w-full relative min-h-[440px]">
          <InteractiveMap
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={onSelectProperty}
            onOpenDetails={onOpenDetails}
            activeType={activeType}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${className}`}>
      {/* Top Map Type Controls & Attribution Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Engine & Layer Selector */}
        <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/15 pointer-events-auto shadow-lg">
          <div className="flex items-center gap-1.5 px-2 py-0.5 border-r border-white/10 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Google Maps Vector Engine
          </div>

          <button
            onClick={() => setMapTypeId('hybrid')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
              mapTypeId === 'hybrid'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Hybrid
          </button>
          <button
            onClick={() => setMapTypeId('satellite')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
              mapTypeId === 'satellite'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTypeId('roadmap')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
              mapTypeId === 'roadmap'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setMapTypeId('terrain')}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
              mapTypeId === 'terrain'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Right: Active Property Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {actionNotice && (
            <div className="px-3 py-1.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono font-bold shadow-lg animate-bounce">
              {actionNotice}
            </div>
          )}
          <div className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-neutral-300 text-[10px] font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{properties.length} Estates Tracked</span>
          </div>
        </div>
      </div>

      {/* Main Google Maps Viewport */}
      <div className="w-full h-full min-h-[500px]">
        <APIProvider apiKey={apiKey} region="TZ" onError={() => setLoadError('Google Maps API Load Error')}>
          <Map
            defaultCenter={
              selectedProperty
                ? { lat: selectedProperty.location.lat, lng: selectedProperty.location.lng }
                : DEFAULT_CENTER
            }
            defaultZoom={DEFAULT_ZOOM}
            mapId="DEMO_MAP_ID"
            renderingType="VECTOR"
            mapTypeId={mapTypeId}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            disableDefaultUI={false}
            gestureHandling="greedy"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Advanced Markers for Luxury Properties */}
            {properties.map((property) => {
              const isSelected = selectedProperty?.id === property.id;
              const isCommercial = property.type === 'Commercial' || property.type === 'Land';

              return (
                <AdvancedMarker
                  key={property.id}
                  position={{ lat: property.location.lat, lng: property.location.lng }}
                  onClick={() => handleMarkerClick(property)}
                  title={property.title}
                >
                  <div className="relative group cursor-pointer transform transition-transform duration-200 hover:scale-110">
                    {/* Pulsing radar ring on selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                    )}

                    {/* Luxury Price Pill */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-tight shadow-2xl transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white border-2 border-white ring-4 ring-red-600/30'
                          : isCommercial
                          ? 'bg-amber-600 text-white border border-white/40'
                          : 'bg-zinc-900 text-white border border-red-500/60 hover:border-red-500 hover:bg-black'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{formatPrice(property.price)}</span>
                      {property.metadata?.cap_rate && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-emerald-300">
                          {property.metadata.cap_rate}%
                        </span>
                      )}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* Interactive Info Window for Selected Marker */}
            {activeMarkerProperty && (
              <InfoWindow
                position={{
                  lat: activeMarkerProperty.location.lat,
                  lng: activeMarkerProperty.location.lng,
                }}
                onCloseClick={() => setActiveMarkerProperty(null)}
              >
                <div className="max-w-[280px] p-1 text-zinc-900 font-sans">
                  <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-neutral-100">
                    <img
                      src={activeMarkerProperty.media.hero_image}
                      alt={activeMarkerProperty.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono uppercase font-bold tracking-wider">
                      {activeMarkerProperty.location.neighborhood || activeMarkerProperty.location.city}
                    </div>
                    {activeMarkerProperty.media.cinematic_video_url && (
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> 4K Tour
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 mb-0.5">
                    {activeMarkerProperty.title}
                  </h4>
                  <div className="text-xs text-zinc-600 font-mono mb-2">
                    {activeMarkerProperty.location.address}
                  </div>

                  <div className="flex items-center justify-between py-1 border-t border-zinc-200 mb-2">
                    <span className="text-sm font-black text-red-600 font-mono">
                      {formatPrice(activeMarkerProperty.price)}
                    </span>
                    {activeMarkerProperty.metadata?.cap_rate && (
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Cap: {activeMarkerProperty.metadata.cap_rate}%
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => onOpenDetails(activeMarkerProperty)}
                      className="w-full px-2 py-1.5 bg-zinc-900 hover:bg-black text-white rounded text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Dossier
                    </button>
                    <button
                      onClick={(e) => handleQuickSchedule(e, activeMarkerProperty)}
                      className="w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1"
                      title="Add to Google Calendar"
                    >
                      <Calendar className="w-3 h-3" /> Schedule
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Mandatory Attribution Requirements */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
        <div className="px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-neutral-400 border border-white/10">
          Google Maps
        </div>
      </div>
    </div>
  );
};
