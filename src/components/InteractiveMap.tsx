import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from '../types';
import { Play, Volume2, VolumeX, Maximize2, ExternalLink, MapPin, TrendingUp, Home } from 'lucide-react';

// Tanzania territorial boundary constraints (Southwest to Northeast)
const TANZANIA_BOUNDS = L.latLngBounds(
  [-11.85, 29.20], // SW: Southern border & Lake Tanganyika
  [-0.90, 40.60]   // NE: Northern border & Indian Ocean
);

// Dar es Salaam coastal luxury & diplomatic corridor coordinates
const DAR_ES_SALAAM_CENTER: [number, number] = [-6.7720, 39.2400];
const DEFAULT_DAR_ZOOM = 11;
const MIN_TANZANIA_ZOOM = 6;
const MAX_SATELLITE_ZOOM = 19;

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
  activeType: 'All' | 'Invest' | 'Live';
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetails,
  activeType,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const initialLoadRef = useRef<boolean>(false);
  const satelliteTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const darkTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [activeMiniPlayer, setActiveMiniPlayer] = useState<Property | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'satellite' | 'hybrid' | 'dark'>('satellite');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Map with Satellite View centered on Dar es Salaam & restricted to Tanzania
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Viewport strictly restricted to Tanzania's coordinates and centered on Dar es Salaam
    const map = L.map(mapContainerRef.current, {
      center: DAR_ES_SALAAM_CENTER,
      zoom: DEFAULT_DAR_ZOOM,
      minZoom: MIN_TANZANIA_ZOOM,
      maxZoom: MAX_SATELLITE_ZOOM,
      maxBounds: TANZANIA_BOUNDS,
      maxBoundsViscosity: 1.0, // Strictly enforce boundary restriction within Tanzania
      zoomControl: false,
    });

    // Add zoom controls to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Primary High-Resolution Satellite View (Esri World Imagery)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
      }
    );

    // High-Contrast Labels & Borders Overlay
    const labelsLayer = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxZoom: 19,
      }
    );

    // Dark Matter Tactical Fallback Layer
    const darkLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    );

    satelliteTileLayerRef.current = satelliteLayer;
    labelsTileLayerRef.current = labelsLayer;
    darkTileLayerRef.current = darkLayer;

    // Default to Satellite View with Crisp Boundary Overlays
    satelliteLayer.addTo(map);
    labelsLayer.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Satellite / Hybrid / Tactical Dark Mode Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !satelliteTileLayerRef.current || !labelsTileLayerRef.current || !darkTileLayerRef.current) return;

    map.removeLayer(satelliteTileLayerRef.current);
    map.removeLayer(labelsTileLayerRef.current);
    map.removeLayer(darkTileLayerRef.current);

    if (mapMode === 'satellite') {
      satelliteTileLayerRef.current.addTo(map);
    } else if (mapMode === 'hybrid') {
      satelliteTileLayerRef.current.addTo(map);
      labelsTileLayerRef.current.addTo(map);
    } else if (mapMode === 'dark') {
      darkTileLayerRef.current.addTo(map);
    }
  }, [mapMode]);

  // Sync Markers with properties
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.keys(markersRef.current).forEach((id) => {
      markersRef.current[id]?.remove();
    });
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = L.latLngBounds([]);

    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;
      const isInvest = prop.property_type === 'Invest';

      // Custom Red Metallic FLX Pin Marker
      const customIcon = L.divIcon({
        className: 'flx-custom-pin',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <!-- Pulse Glow for featured or selected -->
            <div class="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-red-600/30 flx-radar-ring ${isSelected ? 'scale-125' : ''}"></div>
            
            <!-- Pin Body: Metallic Black with Ruby Red Facet -->
            <div class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-[#2a2d34] via-[#16181c] to-[#090a0c] border-2 ${isSelected ? 'border-[#ff1a26] shadow-[0_0_15px_#e50914]' : 'border-white/20 hover:border-red-500'} shadow-2xl transition-all transform group-hover:scale-110">
              <span class="text-[10px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-600">
                FLX
              </span>
            </div>

            <!-- Price & Type Badge below pin -->
            <div class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight bg-[#111317]/90 backdrop-blur-sm border ${isInvest ? 'border-emerald-500/40 text-emerald-300' : 'border-red-500/40 text-red-300'} shadow-lg whitespace-nowrap">
              $${(prop.price / 1000000).toFixed(1)}M ${isInvest && prop.metadata.cap_rate ? `• ${prop.metadata.cap_rate}%` : ''}
            </div>
            
            <!-- Pointed Arrow -->
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#090a0c] -mt-[1px]"></div>
          </div>
        `,
        iconSize: [40, 56],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      });

      const marker = L.marker([prop.location.lat, prop.location.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectProperty(prop);
        setActiveMiniPlayer(prop);
        map.flyTo([prop.location.lat, prop.location.lng], Math.max(map.getZoom(), 12), {
          duration: 1.2,
        });
      });

      marker.addTo(map);
      markersRef.current[prop.id] = marker;
      bounds.extend([prop.location.lat, prop.location.lng]);
    });

    // On initial load, preserve focus on Dar es Salaam; only fit bounds on subsequent filter changes if not selected
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      map.setView(DAR_ES_SALAAM_CENTER, DEFAULT_DAR_ZOOM);
    }
  }, [properties, selectedProperty]);

  const focusDarEsSalaam = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DAR_ES_SALAAM_CENTER, DEFAULT_DAR_ZOOM, { duration: 1.0 });
    }
  };

  const focusAllTanzania = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-6.3690, 35.7516], 6.5, { duration: 1.0 });
    }
  };

  // Fly to selected property when selected from external component (e.g. card click)
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedProperty.location.lat, selectedProperty.location.lng],
        13,
        { duration: 1.2 }
      );
      setActiveMiniPlayer(selectedProperty);
    }
  }, [selectedProperty]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#090a0c] ${className}`}>
      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Header Overlay / Badge & Satellite View Mode Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/90 backdrop-blur-md border border-white/10 text-xs text-zinc-300 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-headline font-black text-white tracking-[0.2em] text-[10px] uppercase">FLX SATELLITE RADAR</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-mono text-[11px] uppercase">
            TANZANIA • {properties.length} {activeType === 'All' ? 'ESTATES' : `${activeType.toUpperCase()}`}
          </span>
        </div>

        {/* Viewport Territorial Quick-Focus */}
        <div className="flex items-center bg-black/90 backdrop-blur-md border border-white/15 p-1 shadow-2xl">
          <button
            type="button"
            onClick={focusDarEsSalaam}
            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
            title="Focus Viewport on Dar es Salaam & Masaki Waterfront"
          >
            <MapPin className="w-2.5 h-2.5 text-red-500" />
            DAR ES SALAAM
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={focusAllTanzania}
            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
            title="View Full Tanzanian Territory (Arusha, Serengeti, Zanzibar, Dar es Salaam)"
          >
            ALL TANZANIA
          </button>
        </div>
      </div>

      {/* Satellite Imagery Mode Selector */}
      <div className="absolute top-4 right-14 z-20 flex items-center bg-black/90 backdrop-blur-md border border-white/15 p-1 shadow-2xl">
        <button
          type="button"
          onClick={() => setMapMode('satellite')}
          className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
            mapMode === 'satellite'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="High-Resolution Orbital Satellite View"
        >
          🛰️ SATELLITE
        </button>
        <button
          type="button"
          onClick={() => setMapMode('hybrid')}
          className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
            mapMode === 'hybrid'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Satellite Imagery with Topographic & Place Labels"
        >
          HYBRID
        </button>
        <button
          type="button"
          onClick={() => setMapMode('dark')}
          className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
            mapMode === 'dark'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Dark Radar Tactical Basemap"
        >
          DARK
        </button>
      </div>

      {/* Floating Mini-Player Preview on Pin Click */}
      {activeMiniPlayer && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-black border border-red-600 p-5 shadow-[0_0_50px_rgba(220,38,38,0.35)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  activeMiniPlayer.property_type === 'Invest'
                    ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400'
                    : 'bg-red-950 border border-red-500/60 text-red-400'
                }`}
              >
                {activeMiniPlayer.property_type}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1 uppercase">
                <MapPin className="w-3 h-3 text-red-600" />
                {activeMiniPlayer.location.city}, {activeMiniPlayer.location.state}
              </span>
            </div>
            <button
              onClick={() => setActiveMiniPlayer(null)}
              className="text-zinc-400 hover:text-white text-xs w-6 h-6 border border-white/10 hover:bg-zinc-900 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Autoplaying Video Preview / Mini-Player */}
          <div className="relative aspect-video overflow-hidden bg-black mb-3 border border-white/10 group">
            <video
              ref={videoRef}
              src={activeMiniPlayer.video_url}
              poster={activeMiniPlayer.thumbnail_url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Video overlay badges */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black text-[9px] font-mono text-red-500 border border-red-600 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {activeMiniPlayer.video_resolution || '4K MUX STREAM'}
            </div>

            {/* Audio Toggle button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-2 right-2 p-1.5 bg-black/80 hover:bg-black text-white border border-white/20 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-500" />}
            </button>
          </div>

          {/* Title & Key Financial / Luxury Metrics */}
          <div className="mb-4">
            <h4 className="font-black italic text-white text-base truncate uppercase tracking-tight">
              {activeMiniPlayer.title}
            </h4>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-white font-mono">
                {formatCurrency(activeMiniPlayer.price)}
              </span>
              {activeMiniPlayer.property_type === 'Invest' && activeMiniPlayer.metadata.cap_rate ? (
                <span className="text-xs font-black text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/30">
                  <TrendingUp className="w-3 h-3" />
                  {activeMiniPlayer.metadata.cap_rate}% CAP RATE
                </span>
              ) : (
                <span className="text-xs text-zinc-400 font-mono">
                  {activeMiniPlayer.metadata.beds} BEDS • {activeMiniPlayer.metadata.baths} BATHS • {activeMiniPlayer.metadata.sqft.toLocaleString()} SQFT
                </span>
              )}
            </div>
          </div>

          {/* Action Button: View Full Tour */}
          <button
            onClick={() => onOpenDetails(activeMiniPlayer)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-700 to-red-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg border border-red-600/50 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch Full Inspection Tour</span>
          </button>
        </div>
      )}
    </div>
  );
};
