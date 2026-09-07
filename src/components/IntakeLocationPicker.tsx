import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  RefreshCw,
  Layers,
  Compass,
  Building2,
  Navigation2,
  Copy
} from 'lucide-react';
import {
  TANZANIA_STREETS,
  TANZANIA_REGIONS,
  searchTanzaniaLocations,
  findNearestTanzaniaStreet,
  TanzaniaStreet
} from '../data/tanzaniaLocations';
import { TanzaniaAdministrativeSelector } from './TanzaniaAdministrativeSelector';

interface IntakeLocationPickerProps {
  currentCoords: { lat: number; lng: number; accuracy?: number };
  onCoordsChange: (coords: { lat: number; lng: number; accuracy?: number }) => void;
  address: string;
  setAddress: (val: string) => void;
  ward: string;
  setWard: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  region: string;
  setRegion: (val: string) => void;
  zip: string;
  setZip: (val: string) => void;
  gpsStatus: string;
  setGpsStatus: (val: string) => void;
  gpsLoading: boolean;
  onSnapToCurrentLocation: () => void;
}

export const IntakeLocationPicker: React.FC<IntakeLocationPickerProps> = ({
  currentCoords,
  onCoordsChange,
  address,
  setAddress,
  ward,
  setWard,
  district,
  setDistrict,
  city,
  setCity,
  region,
  setRegion,
  zip,
  setZip,
  gpsStatus,
  setGpsStatus,
  gpsLoading,
  onSnapToCurrentLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Search & Autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TanzaniaStreet[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Map view layers
  const [mapMode, setMapMode] = useState<'satellite' | 'hybrid' | 'dark'>('satellite');
  const satelliteTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const darkTileLayerRef = useRef<L.TileLayer | null>(null);

  // Dedicated Latitude & Longitude input states for real-time auto-population and editing
  const [latInput, setLatInput] = useState<string>(currentCoords.lat.toFixed(6));
  const [lngInput, setLngInput] = useState<string>(currentCoords.lng.toFixed(6));
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  // Synchronize inputs whenever currentCoords updates (via GPS Snap, map click, or search)
  useEffect(() => {
    setLatInput(currentCoords.lat.toFixed(6));
    setLngInput(currentCoords.lng.toFixed(6));
  }, [currentCoords.lat, currentCoords.lng]);

  const handleLatInputChange = (val: string) => {
    setLatInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
      onCoordsChange({ lat: parsed, lng: currentCoords.lng, accuracy: currentCoords.accuracy });
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([parsed, currentCoords.lng]);
        mapInstanceRef.current.panTo([parsed, currentCoords.lng]);
      }
    }
  };

  const handleLngInputChange = (val: string) => {
    setLngInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
      onCoordsChange({ lat: currentCoords.lat, lng: parsed, accuracy: currentCoords.accuracy });
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([currentCoords.lat, parsed]);
        mapInstanceRef.current.panTo([currentCoords.lat, parsed]);
      }
    }
  };

  const handleCopyCoordinates = () => {
    const coordStr = `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Preset Fast Jump Hubs in Tanzania
  const PRESET_HUBS = [
    { label: 'Masaki Peninsula', lat: -6.7495, lng: 39.2782, ward: 'Masaki', district: 'Kinondoni', region: 'Dar es Salaam', street: '14 Toure Drive' },
    { label: 'Oysterbay Coastal', lat: -6.7725, lng: 39.2741, ward: 'Oysterbay', district: 'Kinondoni', region: 'Dar es Salaam', street: '28 Kenyatta Drive' },
    { label: 'Msasani Bay', lat: -6.7610, lng: 39.2612, ward: 'Msasani', district: 'Kinondoni', region: 'Dar es Salaam', street: '44 Peninsula Drive' },
    { label: 'Nungwi Beach (Zanzibar)', lat: -5.7258, lng: 39.2982, ward: 'Nungwi', district: 'Kaskazini A', region: 'Zanzibar North (Kaskazini Unguja)', street: 'Nungwi Coral Reef Way' },
    { label: 'Stone Town Seafront', lat: -6.1610, lng: 39.1895, ward: 'Forodhani', district: 'Stone Town (Mjini)', region: 'Zanzibar (Mjini Magharibi)', street: 'Forodhani Seafront Promenade' },
    { label: 'Arusha Golf / Sekei', lat: -3.3685, lng: 36.6950, ward: 'Sekei', district: 'Arusha City', region: 'Arusha', street: 'Old Moshi Road' },
    { label: 'Shanty Town (Moshi)', lat: -3.3420, lng: 37.3250, ward: 'Shanty Town', district: 'Moshi Urban', region: 'Kilimanjaro', street: 'Shanty Town Boulevard' },
    { label: 'Capri Point (Mwanza)', lat: -2.5180, lng: 32.8980, ward: 'Capri Point', district: 'Nyamagana', region: 'Mwanza', street: 'Capri Point Ridge Road' },
    { label: 'Mtumba Gov City (Dodoma)', lat: -6.0420, lng: 35.8920, ward: 'Mtumba', district: 'Dodoma Urban', region: 'Dodoma', street: 'Mtumba Government City Boulevard' },
  ];

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = currentCoords.lat || -6.7495;
    const initialLng = currentCoords.lng || 39.2782;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: false,
    });

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

    // Dark Matter Tactical Basemap
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

    // Default to Satellite with Labels
    satelliteLayer.addTo(map);
    labelsLayer.addTo(map);

    // Custom Target Crosshair Pin for Estate Positioning
    const customPin = L.divIcon({
      className: 'estate-pin-marker',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-crosshair">
          <div class="absolute w-8 h-8 rounded-full bg-red-600/30 animate-ping"></div>
          <div class="relative w-7 h-7 rounded-full bg-black border-2 border-red-600 shadow-[0_0_20px_#ef4444] flex items-center justify-center text-white">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          </div>
          <div class="absolute -bottom-6 px-2 py-0.5 bg-black/90 border border-red-500 text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-lg">
            ESTATE PIN
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: customPin,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    // Handle marker drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      handlePointSelected(pos.lat, pos.lng);
    });

    // Handle map click to place pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      handlePointSelected(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update mapMode layer switching
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

  // Sync marker and map viewport when coordinates change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - currentCoords.lat) > 0.0001 ||
        Math.abs(currentPos.lng - currentCoords.lng) > 0.0001
      ) {
        markerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
        mapInstanceRef.current.panTo([currentCoords.lat, currentCoords.lng]);
      }
    }
  }, [currentCoords.lat, currentCoords.lng]);

  // Handle when user selects or clicks a point on the map
  const handlePointSelected = (lat: number, lng: number) => {
    onCoordsChange({ lat, lng, accuracy: 2 });

    // Look up closest known Tanzanian street/ward
    const nearest = findNearestTanzaniaStreet(lat, lng);
    if (nearest) {
      setAddress(`${nearest.name}`);
      setWard(nearest.ward);
      setDistrict(nearest.district);
      setCity(nearest.city);
      setRegion(nearest.region);
      setZip(nearest.postalCode);
      setGpsStatus(`Geotag Locked: ${lat.toFixed(5)}, ${lng.toFixed(5)} • Near ${nearest.name}, ${nearest.ward}`);
    } else {
      setGpsStatus(`Geotag Locked: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  };

  // Search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const results = searchTanzaniaLocations(val);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Select street from autocomplete
  const handleSelectStreet = (street: TanzaniaStreet) => {
    setAddress(street.name);
    setWard(street.ward);
    setDistrict(street.district);
    setCity(street.city);
    setRegion(street.region);
    setZip(street.postalCode);
    setSearchQuery(`${street.name} (${street.ward}, ${street.district})`);
    setSearchResults([]);
    setIsSearchFocused(false);

    // Update GPS coordinates
    onCoordsChange({ lat: street.lat, lng: street.lng, accuracy: 1 });
    setGpsStatus(`Geotag Snapped to ${street.name}, ${street.ward} (${street.lat.toFixed(4)}, ${street.lng.toFixed(4)})`);

    // Fly map to selected street
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([street.lat, street.lng]);
      mapInstanceRef.current.flyTo([street.lat, street.lng], 17, { duration: 1.2 });
    }
  };

  // Quick Preset Jump
  const handlePresetJump = (hub: (typeof PRESET_HUBS)[0]) => {
    setAddress(hub.street);
    setWard(hub.ward);
    setDistrict(hub.district);
    setCity(hub.region.includes('Zanzibar') ? 'Zanzibar' : hub.region.includes('Arusha') ? 'Arusha' : hub.region.includes('Kilimanjaro') ? 'Moshi' : hub.region.includes('Mwanza') ? 'Mwanza' : hub.region.includes('Dodoma') ? 'Dodoma' : 'Dar es Salaam');
    setRegion(hub.region);
    onCoordsChange({ lat: hub.lat, lng: hub.lng, accuracy: 1 });
    setGpsStatus(`Jumped to ${hub.label} (${hub.lat.toFixed(4)}, ${hub.lng.toFixed(4)})`);

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([hub.lat, hub.lng]);
      mapInstanceRef.current.flyTo([hub.lat, hub.lng], 16, { duration: 1.0 });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. STANDOUT SNAP TO CURRENT LOCATION & COORDINATES MODULE */}
      <div className="p-5 bg-gradient-to-br from-zinc-950 via-black to-[#130b0b] border border-red-600/40 shadow-2xl space-y-4 rounded-xl">
        {/* Header with Title and Primary 'Snap to Current Location' Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="font-headline font-black text-xs uppercase tracking-[0.25em] text-red-500">
                GEOSPATIAL ON-SITE CADASTRE
              </span>
              {currentCoords.accuracy && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-400">
                  GNSS FIX ±{currentCoords.accuracy}M
                </span>
              )}
            </div>
            <h3 className="font-headline text-lg font-black text-white tracking-tight uppercase">
              GPS Position & Parcel Geotagging
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Auto-populate coordinates using the device Geolocation API or manually refine parcel boundaries.
            </p>
          </div>

          {/* Primary 'Snap to Current Location' button */}
          <button
            type="button"
            id="btn-snap-current-location"
            onClick={onSnapToCurrentLocation}
            disabled={gpsLoading}
            className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:brightness-110 active:scale-[0.98] text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-500 transition-all flex items-center justify-center gap-2.5 shrink-0 group disabled:opacity-75 disabled:cursor-not-allowed rounded-lg"
          >
            <Crosshair className={`w-4 h-4 ${gpsLoading ? 'animate-spin text-white' : 'animate-pulse text-white group-hover:rotate-45 transition-transform'}`} />
            <span>{gpsLoading ? 'ACQUIRING ORBITAL GPS...' : 'SNAP TO CURRENT LOCATION'}</span>
          </button>
        </div>

        {/* Dedicated Latitude and Longitude Auto-Populated Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-1">
          {/* Latitude Field */}
          <div className="lg:col-span-5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="property-latitude" className="font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5 text-red-500 rotate-45" />
                <span>Latitude (°S / N) *</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">
                {parseFloat(latInput) < 0 ? `${Math.abs(parseFloat(latInput) || 0).toFixed(4)}° S (Tanzania)` : `${(parseFloat(latInput) || 0).toFixed(4)}° N`}
              </span>
            </div>
            <div className="relative">
              <input
                id="property-latitude"
                name="latitude"
                type="number"
                step="any"
                required
                value={latInput}
                onChange={(e) => handleLatInputChange(e.target.value)}
                placeholder="-6.749500"
                className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-white/20 focus:border-red-500 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors rounded-lg"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-500 uppercase pointer-events-none">
                LAT
              </span>
            </div>
          </div>

          {/* Longitude Field */}
          <div className="lg:col-span-5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="property-longitude" className="font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5 text-red-500 rotate-90" />
                <span>Longitude (°E / W) *</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">
                {parseFloat(lngInput) >= 0 ? `${(parseFloat(lngInput) || 0).toFixed(4)}° E (East Africa)` : `${Math.abs(parseFloat(lngInput) || 0).toFixed(4)}° W`}
              </span>
            </div>
            <div className="relative">
              <input
                id="property-longitude"
                name="longitude"
                type="number"
                step="any"
                required
                value={lngInput}
                onChange={(e) => handleLngInputChange(e.target.value)}
                placeholder="39.278200"
                className="w-full px-3.5 py-2.5 bg-[#090a0d] border border-white/20 focus:border-red-500 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors rounded-lg"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-500 uppercase pointer-events-none">
                LNG
              </span>
            </div>
          </div>

          {/* Quick Copy Coordinates Button */}
          <div className="sm:col-span-2 lg:col-span-2 flex sm:flex-col justify-end">
            <button
              type="button"
              id="btn-copy-coords"
              onClick={handleCopyCoordinates}
              className="w-full h-[42px] px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 rounded-lg"
              title="Copy GPS coordinates to clipboard"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-red-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Status readout */}
        <div className="flex items-center gap-2 p-2.5 bg-black/80 border border-white/10 text-xs rounded-lg">
          <Compass className={`w-4 h-4 text-red-500 shrink-0 ${gpsLoading ? 'animate-spin' : ''}`} />
          <span className="font-mono text-zinc-300 text-[11px] truncate">
            {gpsStatus}
          </span>
        </div>
      </div>

      {/* 2. TANZANIA ALL-STREET SEARCH & AUTOCOMPLETE */}
      <div className="relative">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-red-500" />
          <span>Tanzania Street Search & Cadastre Registry</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search all street locations in Tanzania (e.g. Toure Drive, Chole, Kenyatta, Nungwi, Old Moshi, Capri Point)..."
            className="w-full pl-10 pr-4 py-3 bg-[#0c0d10] border border-white/15 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3.5 top-3 text-xs text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-black border border-red-500/60 shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-white/10">
            <div className="p-2 bg-zinc-950 text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Matching Registered Tanzania Streets ({searchResults.length})</span>
              <span className="text-red-400">Click to Snap Pin</span>
            </div>
            {searchResults.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStreet(st)}
                className="w-full text-left p-3 hover:bg-red-950/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-red-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{st.name}</span>
                    <span className="px-1.5 py-0.5 bg-white/10 text-[9px] font-mono text-zinc-300">
                      {st.ward}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {st.district} • {st.region} ({st.city}, {st.postalCode})
                  </div>
                  {st.landmarks && st.landmarks.length > 0 && (
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                      Landmarks: {st.landmarks.join(', ')}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white pl-2">
                  {st.lat.toFixed(4)}, {st.lng.toFixed(4)} →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE SATELLITE CADASTRE MAP WITH PIN DROP */}
      <div className="relative border border-white/15 bg-black overflow-hidden shadow-2xl">
        {/* Map Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950/90 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-mono text-xs">●</span>
            <span className="font-bold text-white uppercase text-[11px] tracking-wider">
              INTERACTIVE ESTATE PICKER
            </span>
            <span className="text-zinc-500 text-[10px]">
              (Click anywhere on map or drag pin to position house)
            </span>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1 bg-black border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                mapMode === 'satellite' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapMode('hybrid')}
              className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                mapMode === 'hybrid' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hybrid
            </button>
            <button
              type="button"
              onClick={() => setMapMode('dark')}
              className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                mapMode === 'dark' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="relative h-72 sm:h-80 w-full">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Coordinate Pill */}
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lat: {currentCoords.lat.toFixed(5)}</span>
            <span className="text-zinc-500">|</span>
            <span>Lng: {currentCoords.lng.toFixed(5)}</span>
            {currentCoords.accuracy && (
              <span className="text-zinc-400 text-[9px]">(±{currentCoords.accuracy}m)</span>
            )}
          </div>

          {/* Floating Recenter Button */}
          <button
            type="button"
            onClick={onSnapToCurrentLocation}
            title="Snap to Current Device GPS"
            className="absolute bottom-3 right-3 z-10 p-2.5 bg-red-600 hover:bg-red-700 text-white shadow-xl border border-red-500 transition-all hover:scale-110 active:scale-95"
          >
            <Navigation2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="p-2.5 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-red-500" />
            <span className="font-mono text-zinc-300">{gpsStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('property-latitude');
              if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="text-[10px] text-zinc-400 hover:text-white underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>Edit Coordinates</span>
            <span className="font-mono text-zinc-500">({currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)})</span>
          </button>
        </div>
      </div>

      {/* Preset Fast Jump Buttons */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5 font-bold">
          Quick Jump to Premier Tanzanian Corridors:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_HUBS.map((hub) => (
            <button
              key={hub.label}
              type="button"
              onClick={() => handlePresetJump(hub)}
              className="px-2.5 py-1 bg-[#0c0d10] hover:bg-red-950/40 border border-white/10 hover:border-red-500 text-[10px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
            >
              <span>{hub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. TANZANIA STANDARDIZED ADMINISTRATIVE SELECTOR (REGIONS, DISTRICTS, WARDS) */}
      <TanzaniaAdministrativeSelector
        region={region}
        setRegion={setRegion}
        district={district}
        setDistrict={setDistrict}
        ward={ward}
        setWard={setWard}
        city={city}
        setCity={setCity}
        zip={zip}
        setZip={setZip}
        address={address}
        setAddress={setAddress}
        onLocationSelected={(coords) => {
          onCoordsChange({ lat: coords.lat, lng: coords.lng, accuracy: 2 });
          setGpsStatus(`Geotag aligned with National Cadastre (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
          if (mapInstanceRef.current && markerRef.current) {
            markerRef.current.setLatLng([coords.lat, coords.lng]);
            mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
          }
        }}
      />
    </div>
  );
};
