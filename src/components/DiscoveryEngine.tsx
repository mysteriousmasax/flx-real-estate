import React, { useState, useMemo } from 'react';
import { Property, FilterState, PropertyType, Lead } from '../types';
import { PropertyCard } from './PropertyCard';
import { InteractiveMap } from './InteractiveMap';
import { 
  Search, 
  SlidersHorizontal, 
  Map as MapIcon, 
  Grid, 
  Columns, 
  TrendingUp, 
  Home, 
  Sparkles, 
  X,
  Filter
} from 'lucide-react';

interface DiscoveryEngineProps {
  properties: Property[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (property: Property) => void;
  selectedType: 'All' | PropertyType;
  onSelectType: (type: 'All' | PropertyType) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'created_at' | 'status'>) => void;
}

export const DiscoveryEngine: React.FC<DiscoveryEngineProps> = ({
  properties,
  savedIds,
  onToggleSave,
  onOpenDetails,
  selectedType,
  onSelectType,
  onAddLead,
}) => {
  // Layout view mode: split, map_only, feed_only
  const [layoutMode, setLayoutMode] = useState<'split' | 'map_only' | 'feed_only'>('split');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    property_type: 'All',
    search: '',
    city: 'All',
    min_price: 0,
    max_price: 30000000,
    min_beds: 0,
    min_cap_rate: 0,
    has_video: false,
    sort_by: 'featured',
  });

  // Cities list from properties
  const availableCities = useMemo(() => {
    const cities = new Set(properties.map((p) => p.location.city));
    return ['All', ...Array.from(cities)];
  }, [properties]);

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Type filter (from global or local)
      if (selectedType !== 'All' && prop.property_type !== selectedType) {
        return false;
      }

      // City filter
      if (filters.city !== 'All' && prop.location.city !== filters.city) {
        return false;
      }

      // Price filter
      if (prop.price < filters.min_price || prop.price > filters.max_price) {
        return false;
      }

      // Bedrooms filter
      if (filters.min_beds > 0 && prop.metadata.beds < filters.min_beds) {
        return false;
      }

      // Cap rate filter
      if (filters.min_cap_rate > 0) {
        if (!prop.metadata.cap_rate || prop.metadata.cap_rate < filters.min_cap_rate) {
          return false;
        }
      }

      // Search keyword filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesAddress = prop.location.address.toLowerCase().includes(query);
        const matchesCity = prop.location.city.toLowerCase().includes(query);
        const matchesNeighborhood = prop.location.neighborhood?.toLowerCase().includes(query);
        const matchesDesc = prop.description.toLowerCase().includes(query);

        if (!matchesTitle && !matchesAddress && !matchesCity && !matchesNeighborhood && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort_by === 'price_asc') return a.price - b.price;
      if (filters.sort_by === 'price_desc') return b.price - a.price;
      if (filters.sort_by === 'cap_rate_desc') {
        return (b.metadata.cap_rate || 0) - (a.metadata.cap_rate || 0);
      }
      if (filters.sort_by === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, selectedType, filters]);

  const resetFilters = () => {
    setFilters({
      property_type: 'All',
      search: '',
      city: 'All',
      min_price: 0,
      max_price: 30000000,
      min_beds: 0,
      min_cap_rate: 0,
      has_video: false,
      sort_by: 'featured',
    });
    onSelectType('All');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
      {/* Hero / Filter Controls Bar */}
      <div className="bg-black p-5 border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="SEARCH TANZANIA ESTATES (MASAKI, ZANZIBAR, ARUSHA, SERENGETI), FINISHES..."
              className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-white/10 text-xs text-white placeholder-zinc-500 uppercase tracking-wider font-semibold focus:outline-none focus:border-red-600 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* City Dropdown */}
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-3 py-3 bg-[#0A0A0A] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200 focus:outline-none focus:border-red-600"
            >
              {availableCities.map((city) => (
                <option key={city} value={city} className="bg-black text-white">
                  {city === 'All' ? 'ALL LOCATIONS' : city.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
              className="px-3 py-3 bg-[#0A0A0A] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200 focus:outline-none focus:border-red-600"
            >
              <option value="featured" className="bg-black">CURATED // FEATURED</option>
              <option value="price_desc" className="bg-black">PRICE: HIGH TO LOW</option>
              <option value="price_asc" className="bg-black">PRICE: LOW TO HIGH</option>
              <option value="cap_rate_desc" className="bg-black">HIGHEST YIELD (ROI)</option>
              <option value="newest" className="bg-black">NEWEST LISTINGS</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                showAdvancedFilters
                  ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-[#0A0A0A] border-white/10 text-zinc-300 hover:text-white hover:border-zinc-500'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>

            {/* Layout View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-[#0A0A0A] p-1 border border-white/10">
              <button
                onClick={() => setLayoutMode('split')}
                className={`p-2 text-xs transition-colors ${
                  layoutMode === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="Split Map & Feed"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('map_only')}
                className={`p-2 text-xs transition-colors ${
                  layoutMode === 'map_only' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="Interactive Map Only"
              >
                <MapIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('feed_only')}
                className={`p-2 text-xs transition-colors ${
                  layoutMode === 'feed_only' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="Cinematic Feed Grid Only"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showAdvancedFilters && (
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
            {/* Minimum Bedrooms */}
            <div>
              <label className="text-[9px] uppercase tracking-[0.25em] font-black text-zinc-400 block mb-2">
                Minimum Bedrooms
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFilters({ ...filters, min_beds: num })}
                    className={`flex-1 py-2 text-xs font-black tracking-wider uppercase transition-colors border ${
                      filters.min_beds === num
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-[#0A0A0A] text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Cap Rate (for investors) */}
            <div>
              <label className="text-[9px] uppercase tracking-[0.25em] font-black text-zinc-400 block mb-2">
                Min. Cap Rate (Target Yield %)
              </label>
              <div className="flex gap-2">
                {[0, 6, 8, 10].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFilters({ ...filters, min_cap_rate: rate })}
                    className={`flex-1 py-2 text-xs font-black tracking-wider uppercase transition-colors border ${
                      filters.min_cap_rate === rate
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[#0A0A0A] text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {rate === 0 ? 'Any' : `${rate}%+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Action */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2.5 px-4 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 hover:text-red-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-2xl sm:text-3xl font-black italic tracking-tighter text-white">
            {filteredProperties.length} AVAILABLE ESTATES
          </h2>
          {selectedType !== 'All' && (
            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] bg-red-950 border border-red-600 text-red-300">
              {selectedType} ASSETS ONLY
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] font-black text-zinc-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          RADAR TRACKING ACTIVE
        </div>
      </div>

      {/* Main Content Layout: Split / Map Only / Feed Only */}
      {layoutMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map (5 cols) */}
          <div className="lg:col-span-6 sticky top-28 h-[600px]">
            <InteractiveMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onOpenDetails={onOpenDetails}
              activeType={selectedType}
              className="h-full"
            />
          </div>

          {/* Right Column: Listing Cards Feed (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-2xl bg-[#111317] border border-white/10">
                <Home className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Estates Match Filter</h4>
                <p className="text-xs text-neutral-400 mb-4">Try clearing your filters or search keywords.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  isSaved={savedIds.includes(property.id)}
                  onToggleSave={onToggleSave}
                  onSelect={(prop) => setSelectedProperty(prop)}
                  onOpenDetails={onOpenDetails}
                />
              ))
            )}
          </div>
        </div>
      )}

      {layoutMode === 'map_only' && (
        <div className="h-[700px] w-full">
          <InteractiveMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            onOpenDetails={onOpenDetails}
            activeType={selectedType}
            className="h-full"
          />
        </div>
      )}

      {layoutMode === 'feed_only' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              isSaved={savedIds.includes(property.id)}
              onToggleSave={onToggleSave}
              onSelect={(prop) => setSelectedProperty(prop)}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
