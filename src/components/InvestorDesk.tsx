import React from 'react';
import { Property } from '../types';
import { ArrowUpRight, Building2, FileText, ShieldCheck, TrendingUp } from 'lucide-react';

interface InvestorDeskProps {
  properties: Property[];
  onOpenDetails: (property: Property) => void;
}

export const InvestorDesk: React.FC<InvestorDeskProps> = ({ properties, onOpenDetails }) => {
  const opportunities = properties.filter((property) => property.status === 'Approved' && property.property_type === 'Invest');
  const averageYield = opportunities.length ? opportunities.reduce((sum, property) => sum + (property.metadata.cap_rate || 0), 0) / opportunities.length : 0;
  const totalValue = opportunities.reduce((sum, property) => sum + property.price, 0);
  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <header className="border-b border-white/10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div><span className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 font-black">Investor desk // verified opportunities</span><h1 className="font-headline text-3xl sm:text-5xl font-black italic uppercase text-white mt-2">Underwrite the next move.</h1><p className="text-sm text-zinc-400 max-w-2xl mt-3">Review owner-linked assets with transparent pricing, operating assumptions, and a direct path to due diligence.</p></div>
        <button className="flex items-center gap-2 px-4 py-3 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500/10"><FileText className="w-4 h-4" /> Request data room</button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DeskMetric label="Live opportunities" value={opportunities.length.toString()} icon={<Building2 className="w-4 h-4" />} />
        <DeskMetric label="Average cap rate" value={`${averageYield.toFixed(1)}%`} icon={<TrendingUp className="w-4 h-4" />} accent="text-emerald-400" />
        <DeskMetric label="Tracked asset value" value={money(totalValue)} icon={<ShieldCheck className="w-4 h-4" />} />
        <DeskMetric label="Data confidence" value="Verified" icon={<ShieldCheck className="w-4 h-4" />} accent="text-blue-400" />
      </div>

      <div className="flex items-center justify-between border-b border-white/10 pb-3"><div><span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black">Curated pipeline</span><h2 className="font-headline text-2xl font-black italic uppercase text-white">Investment opportunities</h2></div><span className="text-[10px] uppercase tracking-wider text-zinc-500">Updated live</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {opportunities.map((property) => <article key={property.id} className="border border-white/10 bg-black/70 overflow-hidden hover:border-emerald-500/50 transition-colors"><img src={property.thumbnail_url} alt={property.title} className="w-full aspect-[16/9] object-cover" /><div className="p-4 space-y-3"><div className="flex justify-between gap-3"><span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-black">Verified opportunity</span><span className="text-[10px] text-zinc-500">{property.location.city}</span></div><h3 className="font-black uppercase text-white leading-tight">{property.title}</h3><div className="grid grid-cols-3 gap-2 border-y border-white/10 py-3"><MetricValue label="Price" value={money(property.price)} /><MetricValue label="Cap" value={`${property.metadata.cap_rate || 0}%`} accent="text-emerald-400" /><MetricValue label="Occupancy" value={`${property.metadata.occupancy_rate || 0}%`} /></div><button onClick={() => onOpenDetails(property)} className="w-full flex items-center justify-center gap-2 py-2.5 border border-emerald-500/30 text-emerald-300 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-emerald-500/10">Review opportunity <ArrowUpRight className="w-3.5 h-3.5" /></button></div></article>)}
      </div>
    </div>
  );
};

const DeskMetric: React.FC<{ label: string; value: string; icon: React.ReactNode; accent?: string }> = ({ label, value, icon, accent = 'text-white' }) => <div className="border border-white/10 bg-black/60 p-4"><div className={`flex items-center justify-between text-[9px] uppercase tracking-[0.18em] font-black ${accent}`}><span>{label}</span>{icon}</div><strong className={`block text-xl sm:text-2xl font-mono mt-3 ${accent}`}>{value}</strong></div>;
const MetricValue: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-white' }) => <div className="min-w-0"><span className="block text-[8px] uppercase tracking-wider text-zinc-500">{label}</span><strong className={`block text-xs font-mono truncate mt-1 ${accent}`}>{value}</strong></div>;