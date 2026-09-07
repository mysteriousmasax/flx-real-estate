import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TANZANIA_ADMIN_REGIONS,
  TANZANIA_STREETS,
  searchNationalCadastre,
  CadastreSearchResult,
  AdminRegion,
  AdminDistrict,
  AdminWard,
} from '../data/tanzaniaLocations';
import {
  Search,
  CheckCircle2,
  MapPin,
  Building,
  Landmark,
  Compass,
  Layers,
  ChevronDown,
  Sparkles,
  Info,
  X,
} from 'lucide-react';

interface TanzaniaAdministrativeSelectorProps {
  region: string;
  setRegion: (region: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  ward: string;
  setWard: (ward: string) => void;
  city: string;
  setCity: (city: string) => void;
  zip: string;
  setZip: (zip: string) => void;
  address: string;
  setAddress: (address: string) => void;
  onLocationSelected?: (coords: { lat: number; lng: number }) => void;
}

export const TanzaniaAdministrativeSelector: React.FC<TanzaniaAdministrativeSelectorProps> = ({
  region,
  setRegion,
  district,
  setDistrict,
  ward,
  setWard,
  city,
  setCity,
  zip,
  setZip,
  address,
  setAddress,
  onLocationSelected,
}) => {
  // Mode toggle: 'search' (Search-as-you-type) vs 'hierarchy' (Cascading Dropdowns)
  const [activeMode, setActiveMode] = useState<'search' | 'hierarchy'>('search');

  // Search-as-you-type state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CadastreSearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Ward search-as-you-type filter within hierarchy mode
  const [wardFilterQuery, setWardFilterQuery] = useState('');

  // Find active region object
  const activeRegionObj = useMemo<AdminRegion>(() => {
    return (
      TANZANIA_ADMIN_REGIONS.find(
        (r) => r.name.toLowerCase() === region.toLowerCase()
      ) || TANZANIA_ADMIN_REGIONS[0]
    );
  }, [region]);

  // Find active district object within active region
  const activeDistrictObj = useMemo<AdminDistrict | undefined>(() => {
    return activeRegionObj.districts.find(
      (d) => d.name.toLowerCase() === district.toLowerCase()
    ) || activeRegionObj.districts[0];
  }, [activeRegionObj, district]);

  // Wards available for active district, filtered by wardFilterQuery if present
  const availableWards = useMemo<AdminWard[]>(() => {
    if (!activeDistrictObj) return [];
    if (!wardFilterQuery.trim()) return activeDistrictObj.wards;
    const q = wardFilterQuery.toLowerCase().trim();
    return activeDistrictObj.wards.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.landmarks?.some((lm) => lm.toLowerCase().includes(q))
    );
  }, [activeDistrictObj, wardFilterQuery]);

  // Suggested streets in current ward
  const suggestedStreets = useMemo(() => {
    return TANZANIA_STREETS.filter(
      (st) =>
        st.region.toLowerCase() === region.toLowerCase() &&
        st.district.toLowerCase() === district.toLowerCase() &&
        st.ward.toLowerCase() === ward.toLowerCase()
    );
  }, [region, district, ward]);

  // Live search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const hits = searchNationalCadastre(val);
      setSearchResults(hits);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Close search popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle selecting a standard cadastre search result
  const handleSelectSearchResult = (hit: CadastreSearchResult) => {
    setRegion(hit.region);
    setDistrict(hit.district);
    setWard(hit.ward);
    setCity(hit.city);
    if (hit.postalCode) {
      setZip(hit.postalCode);
    }
    if (hit.street) {
      setAddress(hit.street);
    } else if (!address) {
      setAddress(`${hit.ward} Prime Estate`);
    }

    if (onLocationSelected) {
      onLocationSelected({ lat: hit.lat, lng: hit.lng });
    }

    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  // Handle cascading Region change
  const handleRegionChange = (newRegionName: string) => {
    setRegion(newRegionName);
    const regObj = TANZANIA_ADMIN_REGIONS.find((r) => r.name === newRegionName);
    if (regObj) {
      const firstDist = regObj.districts[0];
      const firstWard = firstDist?.wards[0];
      setDistrict(firstDist?.name || '');
      setWard(firstWard?.name || '');
      setCity(regObj.capitalCity);
      setZip(firstWard?.postalCode || `${regObj.postalCodePrefix}000`);
      setWardFilterQuery('');

      if (onLocationSelected) {
        onLocationSelected({
          lat: firstWard?.lat || firstDist?.defaultLat || regObj.defaultLat,
          lng: firstWard?.lng || firstDist?.defaultLng || regObj.defaultLng,
        });
      }
    }
  };

  // Handle cascading District change
  const handleDistrictChange = (newDistrictName: string) => {
    setDistrict(newDistrictName);
    const distObj = activeRegionObj.districts.find((d) => d.name === newDistrictName);
    if (distObj) {
      const firstWard = distObj.wards[0];
      setWard(firstWard?.name || '');
      setZip(firstWard?.postalCode || `${activeRegionObj.postalCodePrefix}000`);
      setWardFilterQuery('');

      if (onLocationSelected) {
        onLocationSelected({
          lat: firstWard?.lat || distObj.defaultLat || activeRegionObj.defaultLat,
          lng: firstWard?.lng || distObj.defaultLng || activeRegionObj.defaultLng,
        });
      }
    }
  };

  // Handle cascading Ward selection
  const handleWardSelect = (wardObj: AdminWard) => {
    setWard(wardObj.name);
    if (wardObj.postalCode) {
      setZip(wardObj.postalCode);
    }
    if (onLocationSelected && wardObj.lat && wardObj.lng) {
      onLocationSelected({ lat: wardObj.lat, lng: wardObj.lng });
    }
  };

  // Generate standardized National Cadastre Code
  const nationalCadastreCode = useMemo(() => {
    const rCode = region.substring(0, 3).toUpperCase();
    const dCode = district.substring(0, 3).toUpperCase();
    const wCode = ward.substring(0, 3).toUpperCase();
    return `TZ-${rCode}-${dCode}-${wCode}`;
  }, [region, district, ward]);

  // Grouped Regions by Zone for polished select dropdown
  const groupedRegions = useMemo(() => {
    const zones: Record<string, AdminRegion[]> = {};
    for (const r of TANZANIA_ADMIN_REGIONS) {
      if (!zones[r.zone]) zones[r.zone] = [];
      zones[r.zone].push(r);
    }
    return zones;
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <h4 className="font-headline font-bold text-xs uppercase tracking-[0.18em] text-white">
              Tanzania National Cadastre Standardization
            </h4>
            <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              OFFICIAL HIERARCHY
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Standardized administrative schema: <span className="text-white">Region (Mkoa) → District (Wilaya) → Ward (Kata) → Street/Parcel</span>
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-black/60 p-1 border border-white/10 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveMode('search')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
              activeMode === 'search'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-3 h-3" />
            <span>Search-As-You-Type</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('hierarchy')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 ${
              activeMode === 'hierarchy'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Cascading Dropdowns</span>
          </button>
        </div>
      </div>

      {/* 1. UNIVERSAL SEARCH-AS-YOU-TYPE AUTOCOMPLETE INPUT */}
      <div ref={searchContainerRef} className="relative">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-red-500" />
            <span>National Administrative Search-As-You-Type</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500 lowercase font-normal">
            type any region, district, ward, or street
          </span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
            }}
            placeholder="Search across all 31 Tanzanian regions, districts, wards (e.g. Masaki, Kinondoni, Shanty Town, Nungwi, Capri Point, Mtumba)..."
            className="w-full pl-10 pr-10 py-3 bg-[#0c0d10] border border-white/20 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setIsSearchOpen(false);
              }}
              className="absolute right-3.5 top-3 text-xs text-zinc-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Popover */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-black border border-red-500/70 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 max-h-80 overflow-y-auto divide-y divide-white/10">
            <div className="p-2.5 bg-zinc-950 text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Standardized Administrative Matches ({searchResults.length})</span>
              <span className="text-red-400 font-bold">Select to Snap Cadastre & Map</span>
            </div>
            {searchResults.map((hit, idx) => (
              <button
                key={`${hit.level}-${hit.primaryName}-${idx}`}
                type="button"
                onClick={() => handleSelectSearchResult(hit)}
                className="w-full text-left p-3 hover:bg-red-950/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                        hit.level === 'ward'
                          ? 'bg-red-950 text-red-300 border-red-700/50'
                          : hit.level === 'district'
                          ? 'bg-amber-950 text-amber-300 border-amber-700/50'
                          : hit.level === 'street'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/50'
                          : 'bg-blue-950 text-blue-300 border-blue-700/50'
                      }`}
                    >
                      {hit.level === 'ward'
                        ? 'WARD / KATA'
                        : hit.level === 'district'
                        ? 'DISTRICT / WILAYA'
                        : hit.level === 'street'
                        ? 'STREET / MTAA'
                        : 'REGION / MKOA'}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-red-400">
                      {hit.primaryName}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{hit.secondaryText}</span>
                  </div>
                </div>

                <div className="text-right pl-3">
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white block">
                    {hit.lat.toFixed(4)}, {hit.lng.toFixed(4)}
                  </span>
                  <span className="text-[9px] text-red-400 font-mono">Apply →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. STANDARDIZED CASCADING DROPDOWNS & FILTERABLE INPUTS */}
      <div className="p-4 bg-[#0a0c0e] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* A. REGION / MKOA DROPDOWN */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>1. Region / Mkoa *</span>
              <span className="text-[10px] text-zinc-500 font-mono">31 Standard Regions</span>
            </label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d10] border border-white/20 text-xs text-white focus:border-red-500 focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {(Object.entries(groupedRegions) as [string, AdminRegion[]][]).map(([zoneName, regList]) => (
                  <optgroup key={zoneName} label={`ZONE: ${zoneName.toUpperCase()}`} className="bg-zinc-900 text-red-400 font-bold">
                    {regList.map((r) => (
                      <option key={r.name} value={r.name} className="bg-black text-white font-normal">
                        {r.name} ({r.districts.length} Districts)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* B. DISTRICT / WILAYA DROPDOWN */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>2. District / Wilaya *</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {activeRegionObj.districts.length} in {activeRegionObj.name}
              </span>
            </label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d10] border border-white/20 text-xs text-white focus:border-red-500 focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {activeRegionObj.districts.map((d) => (
                  <option key={d.name} value={d.name} className="bg-black text-white">
                    {d.name} ({d.wards.length} Wards)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* C. WARD / KATA SELECTOR & SEARCH-AS-YOU-TYPE */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>3. Ward / Kata *</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {activeDistrictObj?.wards.length || 0} Registered Wards
              </span>
            </label>

            {/* If more than 5 wards, show a search-as-you-type filter input */}
            {(activeDistrictObj?.wards.length || 0) > 4 && (
              <div className="relative mb-1.5">
                <input
                  type="text"
                  value={wardFilterQuery}
                  onChange={(e) => setWardFilterQuery(e.target.value)}
                  placeholder={`Filter ${activeDistrictObj?.name} wards...`}
                  className="w-full pl-7 pr-6 py-1.5 bg-black/70 border border-white/10 text-[11px] text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-2" />
                {wardFilterQuery && (
                  <button
                    type="button"
                    onClick={() => setWardFilterQuery('')}
                    className="absolute right-2 top-1.5 text-zinc-500 hover:text-white text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            <div className="relative">
              <select
                value={ward}
                onChange={(e) => {
                  const targetWard = activeDistrictObj?.wards.find(
                    (w) => w.name === e.target.value
                  );
                  if (targetWard) {
                    handleWardSelect(targetWard);
                  } else {
                    setWard(e.target.value);
                  }
                }}
                className="w-full p-2.5 bg-[#0c0d10] border border-white/20 text-xs text-white focus:border-red-500 focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {availableWards.map((w) => (
                  <option key={w.name} value={w.name} className="bg-black text-white">
                    {w.name} {w.postalCode ? `(${w.postalCode})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* D. STREET & PARCEL DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1 flex items-center justify-between">
              <span>4. Street Address / Plot Designation *</span>
              {suggestedStreets.length > 0 && (
                <span className="text-[10px] text-red-400 font-mono">
                  {suggestedStreets.length} Known Streets in {ward}
                </span>
              )}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Toure Drive, Plot 28 / Coastal Villa 4"
              className="w-full p-2.5 bg-[#0c0d10] border border-white/20 text-xs text-white focus:border-red-500 focus:outline-none"
            />

            {/* Quick click suggestions for known streets in this ward */}
            {suggestedStreets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-zinc-500 font-mono">Quick Street:</span>
                {suggestedStreets.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setAddress(`${st.name}, Plot 1`);
                      if (onLocationSelected) {
                        onLocationSelected({ lat: st.lat, lng: st.lng });
                      }
                    }}
                    className="px-2 py-0.5 bg-zinc-900 hover:bg-red-950/60 border border-white/10 hover:border-red-500 text-[10px] text-zinc-300 hover:text-white transition-all font-mono"
                  >
                    + {st.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              5. National Postcode (Zip)
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 14111"
              className="w-full p-2.5 bg-[#0c0d10] border border-white/20 text-xs text-white font-mono focus:border-red-500 focus:outline-none text-center"
            />
          </div>
        </div>
      </div>

      {/* 3. NATIONAL CADASTRE VERIFICATION BADGE & BREADCRUMB */}
      <div className="p-3 bg-gradient-to-r from-black via-zinc-950 to-black border border-white/10 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-red-500 shrink-0" />
          <div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="text-zinc-500 font-sans">Tanzania</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300 font-bold">{region}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300 font-bold">{district}</span>
              <span className="text-zinc-600">/</span>
              <span className="px-2 py-0.5 bg-red-950/90 text-red-400 border border-red-800/60 font-bold">
                Kata: {ward}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-white font-sans font-semibold">{address || 'Parcel Pending'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[10px] font-mono text-zinc-400">
            Cadastre ID: <span className="text-emerald-400 font-bold">{nationalCadastreCode}</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
            Standardized ✓
          </span>
        </div>
      </div>
    </div>
  );
};
