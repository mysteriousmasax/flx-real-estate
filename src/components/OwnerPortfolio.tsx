import React from 'react';
import { Lead, Property } from '../types';
import { Building2, CheckCircle2, Clock3, Eye, FileText, MessageSquare, ShieldCheck } from 'lucide-react';

interface OwnerPortfolioProps {
  properties: Property[];
  leads: Lead[];
  onViewProperty: (property: Property) => void;
}

export const OwnerPortfolio: React.FC<OwnerPortfolioProps> = ({ properties, leads, onViewProperty }) => {
  const ownerProperties = properties.filter((property) => property.owner);
  const activeLeads = leads.filter((lead) => ownerProperties.some((property) => property.id === lead.property_id));
  const published = ownerProperties.filter((property) => property.status === 'Approved').length;
  const pending = ownerProperties.filter((property) => property.status === 'Pending').length;
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <section className="relative overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-[#10211f] via-[#0c1518] to-black p-6 sm:p-8">
        <div className="absolute right-6 top-6 text-emerald-400/20"><ShieldCheck className="w-24 h-24" /></div>
        <div className="relative max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">OWNER ACCOUNT // ASSET CONTROL</span>
          <h1 className="font-headline text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white mt-2">Your properties, always accounted for.</h1>
          <p className="text-sm leading-relaxed text-zinc-400 mt-3">Every listing submitted by a FLX agent is linked to its owner account. Track publication status, enquiries, tours, and the live price from one place.</p>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Registered assets" value={ownerProperties.length} icon={<Building2 className="w-4 h-4" />} />
        <Metric label="Published online" value={published} icon={<CheckCircle2 className="w-4 h-4" />} accent="text-emerald-400" />
        <Metric label="In verification" value={pending} icon={<Clock3 className="w-4 h-4" />} accent="text-amber-400" />
        <Metric label="Client enquiries" value={activeLeads.length} icon={<MessageSquare className="w-4 h-4" />} accent="text-red-400" />
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
          <div><span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">Linked inventory</span><h2 className="font-headline text-2xl sm:text-3xl font-black italic uppercase text-white">Asset account ledger</h2></div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Owner view</span>
        </div>
        {ownerProperties.length === 0 ? (
          <div className="border border-dashed border-white/15 bg-black/30 p-10 text-center"><FileText className="w-8 h-8 text-zinc-600 mx-auto mb-3" /><p className="text-xs uppercase tracking-[0.2em] text-zinc-500">No owner-linked properties yet</p><p className="text-sm text-zinc-400 mt-2">Ask a FLX agent to register your property and create your owner account.</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ownerProperties.map((property) => {
              const propertyLeads = activeLeads.filter((lead) => lead.property_id === property.id);
              return <article key={property.id} className="border border-white/10 bg-black/60 p-4 flex gap-4">
                <img src={property.thumbnail_url} alt={property.title} className="w-28 h-24 object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><span className={`text-[9px] font-black uppercase tracking-wider ${property.status === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>{property.status.replace('_', ' ')}</span><span className="text-[10px] font-mono text-zinc-500">{propertyLeads.length} enquiries</span></div>
                  <h3 className="font-black uppercase text-white mt-1 truncate">{property.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{property.location.city} • {property.property_type === 'Live' ? 'Home' : 'Income property'}</p>
                  <div className="flex items-center justify-between gap-3 mt-3"><span className="font-mono text-sm font-black text-white">{formatCurrency(property.price)}</span><button onClick={() => onViewProperty(property)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-white"><Eye className="w-3.5 h-3.5" /> Track listing</button></div>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; icon: React.ReactNode; accent?: string }> = ({ label, value, icon, accent = 'text-white' }) => (
  <div className="border border-white/10 bg-black/60 p-4"><div className={`flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-black ${accent}`}><span>{label}</span>{icon}</div><strong className={`block text-3xl font-mono mt-2 ${accent}`}>{value}</strong></div>
);