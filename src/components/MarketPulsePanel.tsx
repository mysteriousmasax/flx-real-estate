import React, { useMemo } from 'react';
import { Property, PropertyType } from '../types';
import { ArrowUpRight, Building2, MapPin, TrendingUp } from 'lucide-react';

interface MarketPulsePanelProps {
  properties: Property[];
  selectedType: 'All' | PropertyType;
}

export const MarketPulsePanel: React.FC<MarketPulsePanelProps> = ({ properties, selectedType }) => {
  const visibleProperties = useMemo(
    () => (selectedType === 'All' ? properties : properties.filter((property) => property.property_type === selectedType)),
    [properties, selectedType]
  );

  const cityStats = useMemo(() => {
    const grouped = new Map<string, Property[]>();

    visibleProperties.forEach((property) => {
      const city = property.location.city || 'Tanzania';
      grouped.set(city, [...(grouped.get(city) || []), property]);
    });

    return Array.from(grouped.entries())
      .map(([city, items]) => ({
        city,
        count: items.length,
        avgPrice: items.reduce((sum, item) => sum + item.price, 0) / items.length,
        avgYield: items.reduce((sum, item) => sum + (item.metadata.cap_rate || 0), 0) / items.length,
      }))
      .sort((a, b) => b.avgPrice - a.avgPrice);
  }, [visibleProperties]);

  const avgPrice = visibleProperties.length
    ? visibleProperties.reduce((sum, item) => sum + item.price, 0) / visibleProperties.length
    : 0;

  const avgYield = visibleProperties.length
    ? visibleProperties.reduce((sum, item) => sum + (item.metadata.cap_rate || 0), 0) / visibleProperties.length
    : 0;

  const hottestCity = cityStats[0];
  const bestYieldCity = [...cityStats].sort((a, b) => b.avgYield - a.avgYield)[0];
  const highestPrice = visibleProperties.reduce((max, item) => Math.max(max, item.price), 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#0d1117] p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.34em] text-red-400">Tanzania Market Pulse</p>
          <h3 className="mt-2 font-headline text-2xl sm:text-4xl font-black italic uppercase text-white">
            Where the market is moving now
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Updated from live inventory
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average asking price"
          value={formatCurrency(avgPrice)}
          hint="Across visible inventory"
          accent="text-white"
          icon={<Building2 className="w-4 h-4" />}
        />
        <MetricCard
          label="Average yield"
          value={`${avgYield.toFixed(1)}%`}
          hint="Target cap rate"
          accent="text-emerald-400"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Hottest market"
          value={hottestCity?.city || 'Tanzania'}
          hint={hottestCity ? `${hottestCity.count} listings active` : 'No data'}
          accent="text-red-300"
          icon={<MapPin className="w-4 h-4" />}
        />
        <MetricCard
          label="Top yield city"
          value={bestYieldCity?.city || 'N/A'}
          hint={bestYieldCity ? `${bestYieldCity.avgYield.toFixed(1)}% avg cap` : 'No yield data'}
          accent="text-blue-300"
          icon={<ArrowUpRight className="w-4 h-4" />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.26em] text-zinc-500">Market leadership</span>
            <span className="text-[10px] font-mono text-zinc-400">Top 5 cities</span>
          </div>
          <div className="space-y-3">
            {cityStats.slice(0, 5).map((city, index) => (
              <div key={city.city} className="flex items-center gap-3">
                <div className="flex w-7 justify-center text-[11px] font-black text-zinc-500">{index + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black uppercase text-white">{city.city}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{city.count} listings</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400"
                      style={{ width: `${Math.min((city.avgPrice / (highestPrice || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="min-w-[95px] text-right text-xs font-mono text-zinc-200">{formatCurrency(city.avgPrice)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-950/30 via-[#0d1117] to-[#0d1117] p-4">
          <span className="text-[10px] font-black uppercase tracking-[0.26em] text-red-400">Smart recommendation</span>
          <h4 className="mt-3 text-lg font-black uppercase text-white">
            {bestYieldCity?.city || 'Tanzania'} deserves attention
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            Average yield is <span className="font-mono text-emerald-400">{bestYieldCity ? `${bestYieldCity.avgYield.toFixed(1)}%` : 'n/a'}</span>, while the market is pricing inventory at <span className="font-mono text-white">{bestYieldCity ? formatCurrency(bestYieldCity.avgPrice) : 'n/a'}</span>.
          </p>
          <div className="mt-4 border-t border-white/10 pt-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Focus: {selectedType === 'All' ? 'All segments' : `${selectedType} listings`}
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string;
  hint: string;
  accent: string;
  icon: React.ReactNode;
}> = ({ label, value, hint, accent, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
    <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] ${accent}`}>
      <span>{label}</span>
      {icon}
    </div>
    <div className={`mt-3 text-2xl font-black font-mono ${accent}`}>{value}</div>
    <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500">{hint}</div>
  </div>
);
