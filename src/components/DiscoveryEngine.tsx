import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface DiscoveryEngineProps {
  audience?: 'Investor' | 'Client';
  properties: Property[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (property: Property) => void;
  selectedType: 'All' | PropertyType;
  onSelectType: (type: 'All' | PropertyType) => void;
  onAddLead: (lead: Omit<import('../types').Lead, 'id' | 'created_at' | 'status'>) => void;
}

export const DiscoveryEngine: React.FC<DiscoveryEngineProps> = ({
  audience = 'Client',
  properties,
  savedIds,
  onToggleSave,
  onOpenDetails,
  selectedType,
  onSelectType,
  onAddLead,
}) => {
  const [layoutMode, setLayoutMode] = useState<'split' | 'map_only' | 'feed_only'>('split');
  const [mapEngine, setMapEngine] = useState<'local' | 'satellite'>('local');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#0e1318]/90 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 text-white/70">
            <span className="text-xs font-black uppercase tracking-[0.25em]">Discovery</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-2xl sm:text-4xl font-black italic tracking-[-0.05em] text-white">
            {audience === 'Investor' ? `${properties.length} INVESTMENT OPPORTUNITIES` : `${properties.length} HOMES TO BUY OR RENT`}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0a0d12] p-1 border border-white/10 rounded-xl">
            <button
              onClick={() => setMapEngine('local')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
                mapEngine === 'local' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Local Map
            </button>
            <button
              onClick={() => setMapEngine('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
                mapEngine === 'satellite' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Satellite Radar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 sticky top-28 h-[600px]">
          {mapEngine === 'local' ? (
            <div className="h-full rounded-2xl border border-white/10 bg-black/30 p-2">
              <div className="h-full">
                <div className="h-full rounded-2xl overflow-hidden">
                  <InteractiveMap
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onOpenDetails={onOpenDetails}
                    activeType={selectedType}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-2xl border border-white/10 bg-black/30 p-2">
              <div className="h-full rounded-2xl overflow-hidden">
                <InteractiveMap
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onOpenDetails={onOpenDetails}
                  activeType={selectedType}
                  className="h-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-6">
          {properties.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-[#111317] border border-white/10">
              <h4 className="text-base font-bold text-white mb-1">No Estates Match Filter</h4>
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className={`rounded-2xl border p-4 ${selectedProperty?.id === property.id ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-[#111317]'}`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{property.location.city}</p>
                    <h3 className="mt-1 text-lg font-black text-white">{property.title}</h3>
                  </div>
                  <button
                    onClick={() => onOpenDetails(property)}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-red-300"
                  >
                    Details
                  </button>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{property.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-300">
                  <span>{property.property_type}</span>
                  <span className="font-black text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
