import React from 'react';
import { Property } from '../types';
import { X, Heart, Maximize2, MapPin, TrendingUp, Home, Trash2 } from 'lucide-react';

interface SavedEstatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSaved: (id: string) => void;
  onOpenDetails: (property: Property) => void;
}

export const SavedEstatesModal: React.FC<SavedEstatesModalProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onOpenDetails,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalValue = savedProperties.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-black border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-white">
              SAVED ESTATES ({savedProperties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-[#0A0A0A]">
          {savedProperties.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Heart className="w-12 h-12 mx-auto mb-2 opacity-20 text-red-600" />
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">NO SAVED ESTATES</p>
              <p className="text-xs text-zinc-600 mt-1 uppercase font-mono">Tap the heart on any property card to pin it here.</p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="p-4 bg-black border border-white/10 hover:border-red-600 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prop.thumbnail_url}
                    alt={prop.title}
                    className="w-20 h-14 object-cover border border-white/10"
                  />
                  <div>
                    <h5 className="text-sm font-black italic uppercase text-white line-clamp-1 tracking-tight">
                      {prop.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                      <span className="text-white font-bold">{formatCurrency(prop.price)}</span>
                      <span className="text-zinc-600">•</span>
                      <span>{prop.location.city}, {prop.location.state}</span>
                      {prop.metadata.cap_rate && (
                        <span className="text-emerald-400 font-black">• {prop.metadata.cap_rate}% CAP</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenDetails(prop);
                      onClose();
                    }}
                    className="p-2.5 bg-gradient-to-r from-red-700 to-red-900 text-white text-xs font-bold transition-all border border-red-600/50 hover:brightness-110"
                    title="View Tour"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveSaved(prop.id)}
                    className="p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-black flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Total Portfolio Valuation</span>
              <strong className="text-white font-mono text-lg font-black">{formatCurrency(totalValue)}</strong>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
