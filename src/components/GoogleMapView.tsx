import React from 'react';
import { Property } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { MapPinned, Compass } from 'lucide-react';

interface GoogleMapViewProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
  activeType?: 'All' | 'Invest' | 'Live';
  className?: string;
  onSwitchToSatellite?: () => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetails,
  activeType = 'All',
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${className}`}>
      <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/80 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white">Local Market Map</span>
        </div>

        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
          <Compass className="w-3.5 h-3.5 text-red-500" />
          <span>{properties.length} estates tracked</span>
        </div>
      </div>

      <div className="h-full pt-12">
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
};
