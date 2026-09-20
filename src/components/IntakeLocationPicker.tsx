import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  RefreshCw,
  Compass,
  Copy,
  Navigation2,
} from 'lucide-react';
import {
  TANZANIA_STREETS,
  searchTanzaniaLocations,
  findNearestTanzaniaStreet,
  TanzaniaStreet,
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

const PRESET_HUBS = [
  { label: 'Masaki Peninsula', lat: -6.7495, lng: 39.2782, ward: 'Masaki', district: 'Kinondoni', region: 'Dar es Salaam', street: '14 Toure Drive' },
  { label: 'Oysterbay Coastal', lat: -6.7725, lng: 39.2741, ward: 'Oysterbay', district: 'Kinondoni', region: 'Dar es Salaam', street: '28 Kenyatta Drive' },
  { label: 'Msasani Bay', lat: -6.7610, lng: 39.2612, ward: 'Msasani', district: 'Kinondoni', region: 'Dar es Salaam', street: '44 Peninsula Drive' },
  { label: 'Arusha Golf / Sekei', lat: -3.3685, lng: 36.6950, ward: 'Sekei', district: 'Arusha City', region: 'Arusha', street: 'Old Moshi Road' },
  { label: 'Stone Town Seafront', lat: -6.1610, lng: 39.1895, ward: 'Forodhani', district: 'Stone Town (Mjini)', region: 'Zanzibar (Mjini Magharibi)', street: 'Forodhani Seafront Promenade' },
];

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTanzaniaLocations(searchQuery);
  }, [searchQuery]);

  const markerX = 30 + ((currentCoords.lng + 10) / 30) * 56;
  const markerY = 70 - ((currentCoords.lat + 12) / 10) * 58;

  const applyLocation = (lat: number, lng: number, locationName: string, regionName: string, districtName: string, wardName: string, cityName: string, zipCode?: string) => {
    onCoordsChange({ lat, lng, accuracy: currentCoords.accuracy });
    setAddress(locationName || `${wardName} Estate`);
    setRegion(regionName);
    setDistrict(districtName);
    setWard(wardName);
    setCity(cityName);
    if (zipCode) setZip(zipCode);
    setGpsStatus('Offline point locked to local Tanzanian property record.');
  };

  const handlePresetSelect = (preset: typeof PRESET_HUBS[number]) => {
    applyLocation(preset.lat, preset.lng, preset.street, preset.region, preset.district, preset.ward, preset.region, zip || '00000');
  };

  const handleSearchSelect = (item: TanzaniaStreet) => {
    setSearchQuery(item.name);
    applyLocation(item.lat, item.lng, item.name, item.region, item.district, item.ward, item.city, item.postalCode || zip);
  };

  const handleCopyCoordinates = () => {
    const coordStr = `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`;
    navigator.clipboard?.writeText(coordStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 1800);
  };

  const nearestStreet = findNearestTanzaniaStreet(currentCoords.lat, currentCoords.lng);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#111317] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Tanzanian location or street..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-xs uppercase tracking-[0.2em] text-white placeholder:text-zinc-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onSnapToCurrentLocation();
              if (nearestStreet) {
                applyLocation(
                  nearestStreet.lat,
                  nearestStreet.lng,
                  nearestStreet.name,
                  nearestStreet.region,
                  nearestStreet.district,
                  nearestStreet.ward,
                  nearestStreet.city,
                  nearestStreet.postalCode,
                );
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white"
          >
            <Crosshair className="h-3.5 w-3.5" />
            {gpsLoading ? 'Locating...' : 'Use GPS'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-2">
            {suggestions.map((item) => (
              <button
                key={`${item.name}-${item.region}-${item.ward}`}
                type="button"
                onClick={() => handleSearchSelect(item)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs text-zinc-300 hover:bg-white/5"
              >
                <span>{item.name}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{item.city}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0b0d10] p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <Compass className="h-3.5 w-3.5 text-red-500" />
              Local coordinate map
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{gpsStatus}</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.15),_rgba(15,23,42,0.95)_40%,_#090b0d_100%)]">
            <svg viewBox="0 0 100 100" className="h-[220px] w-full">
              <path d="M8 22 C 18 10, 30 12, 45 18 S 70 28, 82 18 S 92 10, 96 18 L 96 82 C 84 88, 72 88, 60 83 S 38 70, 26 78 S 12 88, 8 82 Z" fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.25)" strokeWidth="0.8" />
              <path d="M18 48 C 28 40, 42 42, 56 50 S 82 62, 88 54" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx={markerX} cy={markerY} r="6" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.2" />
              <circle cx={markerX} cy={markerY} r="2.3" fill="#fff" />
              <text x="10" y="16" fill="rgba(255,255,255,0.7)" fontSize="5" fontWeight="700" letterSpacing="1.2">DAR ES SALAAM</text>
            </svg>
            <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm">
              {nearestStreet ? nearestStreet.name : 'Offline property site'}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="block rounded-xl border border-white/10 bg-black/30 p-2">
              <span className="mb-1 block text-[9px] uppercase tracking-[0.2em] text-zinc-500">Latitude</span>
              <input
                value={currentCoords.lat.toFixed(6)}
                onChange={(e) => onCoordsChange({ lat: Number(e.target.value), lng: currentCoords.lng, accuracy: currentCoords.accuracy })}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </label>
            <label className="block rounded-xl border border-white/10 bg-black/30 p-2">
              <span className="mb-1 block text-[9px] uppercase tracking-[0.2em] text-zinc-500">Longitude</span>
              <input
                value={currentCoords.lng.toFixed(6)}
                onChange={(e) => onCoordsChange({ lat: currentCoords.lat, lng: Number(e.target.value), accuracy: currentCoords.accuracy })}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#111317] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Quick hubs</p>
            <button type="button" onClick={handleCopyCoordinates} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-zinc-300">
              {copiedCoords ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copiedCoords ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="grid gap-2">
            {PRESET_HUBS.map((hub) => (
              <button
                key={hub.label}
                type="button"
                onClick={() => handlePresetSelect(hub)}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left transition-colors hover:border-red-500/40 hover:bg-red-500/5"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">{hub.label}</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">{hub.region}</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Address</span>
              <Navigation2 className="h-3.5 w-3.5 text-red-500" />
            </div>
            <p className="mt-2 text-sm normal-case tracking-normal text-white">{address || 'No address selected'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111317] p-4">
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
            onCoordsChange({ ...coords, accuracy: currentCoords.accuracy });
            setGpsStatus('Local administrative boundary selected.');
          }}
        />
      </div>
    </div>
  );
};
