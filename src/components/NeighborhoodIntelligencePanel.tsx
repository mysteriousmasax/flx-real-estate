import React, { useMemo } from 'react';
import { Property, PropertyType } from '../types';
import { BadgeDollarSign, Building2, Flame, MapPinned, TrendingUp } from 'lucide-react';

interface NeighborhoodIntelligencePanelProps {
  properties: Property[];
  selectedType: 'All' | PropertyType;
}

export const NeighborhoodIntelligencePanel: React.FC<NeighborhoodIntelligencePanelProps> = ({
  properties,
  selectedType,
}) => {
  const visibleProperties = useMemo(
    () =>
      selectedType === 'All'
        ? properties
        : properties.filter((property) => property.property_type === selectedType),
    [properties, selectedType]
  );

  const neighborhoodStats = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        city: string;
        count: number;
        avgPrice: number;
        avgYield: number;
        demandScore: number;
      }
    >();

    visibleProperties.forEach((property) => {
      const areaName =
        property.location.neighborhood || property.location.ward || property.location.district || property.location.city || 'Tanzania';
      const cityName = property.location.city || 'Tanzania';
      const current = map.get(areaName) || {
        name: areaName,
        city: cityName,
        count: 0,
        avgPrice: 0,
        avgYield: 0,
        demandScore: 0,
      };

      current.count += 1;
      current.avgPrice += property.price;
      current.avgYield += property.metadata.cap_rate || 0;
      current.demandScore += property.featured ? 18 : 8;
      map.set(areaName, current);
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        avgPrice: entry.count ? entry.avgPrice / entry.count : 0,
        avgYield: entry.count ? entry.avgYield / entry.count : 0,
        demandScore: entry.count ? entry.demandScore / entry.count : 0,
      }))
      .sort((a, b) => b.avgYield - a.avgYield || b.avgPrice - a.avgPrice)
      .slice(0, 5);
  }, [visibleProperties]);

  const bestYieldPocket = neighborhoodStats[0];
  const strongestDemand = [...neighborhoodStats].sort((a, b) => b.demandScore - a.demandScore)[0];
  const affordablePocket = [...neighborhoodStats].sort((a, b) => a.avgPrice - b.avgPrice)[0];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#0d1117] p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.34em] text-amber-400">Neighborhood Intelligence</p>
          <h3 className="mt-2 font-headline text-2xl sm:text-3xl font-black italic uppercase text-white">
            Where Tanzanian buyers are looking hardest
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Micro-market lens
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Best yield pocket"
          value={bestYieldPocket ? `${bestYieldPocket.avgYield.toFixed(1)}%` : 'N/A'}
          hint={bestYieldPocket ? bestYieldPocket.name : 'No data'}
          accent="text-emerald-400"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Most active cluster"
          value={strongestDemand ? strongestDemand.name : 'N/A'}
          hint={strongestDemand ? `${strongestDemand.count} listings` : 'No data'}
          accent="text-red-300"
          icon={<Flame className="w-4 h-4" />}
        />
        <MetricCard
          label="Value entry point"
          value={affordablePocket ? formatCurrency(affordablePocket.avgPrice) : 'N/A'}
          hint={affordablePocket ? affordablePocket.name : 'No data'}
          accent="text-sky-300"
          icon={<BadgeDollarSign className="w-4 h-4" />}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.26em] text-zinc-500">Top zones</span>
          <span className="text-[10px] font-mono text-zinc-400">Yield × demand</span>
        </div>

        <div className="space-y-4">
          {neighborhoodStats.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-400">No neighborhood data available for the current filter set.</div>
          ) : (
            neighborhoodStats.map((area, index) => (
              <div key={`${area.name}-${area.city}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/10 text-[10px] font-black text-red-300">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-black uppercase text-white">{area.name}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        <MapPinned className="w-3 h-3" />
                        {area.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-300">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                      {area.avgYield.toFixed(1)}% yield
                    </span>
                    <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-sky-300">
                      {formatCurrency(area.avgPrice)} avg
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-[#0a0d12] p-2.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Listings</div>
                    <div className="mt-1 text-lg font-black text-white">{area.count}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0a0d12] p-2.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Demand signal</div>
                    <div className="mt-1 text-lg font-black text-amber-300">{Math.min(Math.round(area.demandScore), 99)}%</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0a0d12] p-2.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Profile</div>
                    <div className="mt-1 text-sm font-black uppercase text-white">
                      {area.avgYield >= 7 ? 'Investor-led' : area.avgPrice >= 500000 ? 'Premium' : 'Balanced'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
