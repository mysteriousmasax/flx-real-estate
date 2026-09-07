import React, { useState } from 'react';
import { Property, Lead, LeadStatus, ApprovalStatus } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  Play, 
  MapPin, 
  DollarSign, 
  Filter,
  Eye,
  Building2,
  Calendar
} from 'lucide-react';

interface AdminCrmProps {
  properties: Property[];
  leads: Lead[];
  onUpdatePropertyStatus: (propertyId: string, status: ApprovalStatus) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onViewProperty: (property: Property) => void;
}

export const AdminCrm: React.FC<AdminCrmProps> = ({
  properties,
  leads,
  onUpdatePropertyStatus,
  onUpdateLeadStatus,
  onViewProperty,
}) => {
  const [crmTab, setCrmTab] = useState<'queue' | 'analytics' | 'leads'>('queue');
  const [leadFilter, setLeadFilter] = useState<string>('All');
  const [queueFilter, setQueueFilter] = useState<string>('Pending');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Analytics calculations
  const totalValuation = properties
    .filter((p) => p.status === 'Approved')
    .reduce((sum, p) => sum + p.price, 0);

  const pendingValuation = properties
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.price, 0);

  const investProperties = properties.filter((p) => p.property_type === 'Invest');
  const avgCapRate =
    investProperties.length > 0
      ? investProperties.reduce((sum, p) => sum + (p.metadata.cap_rate || 0), 0) / investProperties.length
      : 0;

  const pendingListings = properties.filter((p) => p.status === 'Pending');
  const approvedListings = properties.filter((p) => p.status === 'Approved');

  // Filtered approval queue
  const displayProperties = properties.filter((p) => {
    if (queueFilter === 'All') return true;
    return p.status === queueFilter;
  });

  // Filtered leads
  const displayLeads = leads.filter((l) => {
    if (leadFilter === 'All') return true;
    return l.status === leadFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Portfolio */}
        <div className="p-5 bg-black border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-[0.25em] font-black mb-2">
            <span>Portfolio Volume</span>
            <Building2 className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {formatCurrency(totalValuation)}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1 uppercase">
            {approvedListings.length} ASSETS ONLINE
          </span>
        </div>

        {/* KPI 2: Pending Approval Queue */}
        <div className="p-5 bg-black border border-amber-600/50 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-[9px] uppercase tracking-[0.25em] font-black mb-2">
            <span>Intake Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
            {pendingListings.length} Submissions
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1 uppercase">
            {formatCurrency(pendingValuation)} IN REVIEW
          </span>
        </div>

        {/* KPI 3: Average Cap Rate */}
        <div className="p-5 bg-black border border-emerald-600/50 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-[9px] uppercase tracking-[0.25em] font-black mb-2">
            <span>Yield ROI</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {avgCapRate.toFixed(1)}% Cap
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1 uppercase">
            Across {investProperties.length} Invest Assets
          </span>
        </div>

        {/* KPI 4: Active Investor Leads */}
        <div className="p-5 bg-black border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-[0.25em] font-black mb-2">
            <span>Client Pipeline</span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {leads.length} Inquiries
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block mt-1 uppercase">
            {leads.filter((l) => l.status === 'New').length} NEW LEADS PENDING
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setCrmTab('queue')}
          className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all border ${
            crmTab === 'queue'
              ? 'bg-gradient-to-r from-red-700 to-red-900 text-white border-red-600 shadow-md'
              : 'bg-[#0A0A0A] text-zinc-400 hover:text-white border-white/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Approval Queue ({pendingListings.length})</span>
        </button>

        <button
          onClick={() => setCrmTab('analytics')}
          className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all border ${
            crmTab === 'analytics'
              ? 'bg-gradient-to-r from-red-700 to-red-900 text-white border-red-600 shadow-md'
              : 'bg-[#0A0A0A] text-zinc-400 hover:text-white border-white/10'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Inventory Analytics</span>
        </button>

        <button
          onClick={() => setCrmTab('leads')}
          className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all border ${
            crmTab === 'leads'
              ? 'bg-gradient-to-r from-red-700 to-red-900 text-white border-red-600 shadow-md'
              : 'bg-[#0A0A0A] text-zinc-400 hover:text-white border-white/10'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Client Leads ({leads.length})</span>
        </button>
      </div>

      {/* TAB 1: INTAKE APPROVAL QUEUE */}
      {crmTab === 'queue' && (
        <div className="space-y-4">
          {/* Queue Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0e1013] border border-white/10 text-xs">
              {(['Pending', 'Approved', 'Needs_Revision', 'All'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setQueueFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    queueFilter === status
                      ? 'bg-neutral-800 text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-400">
              Showing {displayProperties.length} listings in {queueFilter} status
            </span>
          </div>

          {/* Queue Listing Cards */}
          {displayProperties.length === 0 ? (
            <div className="text-center py-16 p-8 bg-black border border-white/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-black italic uppercase tracking-tight text-white mb-1">Queue Clear</h4>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono">No properties in "{queueFilter}" review state.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-6 bg-black border border-white/10 hover:border-red-600 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl"
                >
                  {/* Left: Thumbnail / Video & Summary */}
                  <div className="flex items-start sm:items-center gap-5 w-full lg:w-auto">
                    <div className="relative w-28 sm:w-36 aspect-video overflow-hidden bg-black shrink-0 border border-white/10">
                      <img
                        src={prop.thumbnail_url}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-mono bg-black text-red-500 font-black uppercase">
                        {prop.video_resolution || '4K'}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            prop.property_type === 'Invest'
                              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                              : 'bg-red-950 border border-red-500/50 text-red-300'
                          }`}
                        >
                          {prop.property_type}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            prop.status === 'Approved'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : prop.status === 'Pending'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950/60 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {prop.status.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 uppercase">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {prop.location.address}, {prop.location.city}, {prop.location.state}
                        </span>
                      </div>

                      <h4 className="font-black italic text-white text-lg uppercase tracking-tight">
                        {prop.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono flex-wrap">
                        <span className="font-black text-white text-base">
                          {formatCurrency(prop.price)}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span>{prop.metadata.beds} BEDS / {prop.metadata.baths} BATHS</span>
                        <span className="text-zinc-600">•</span>
                        <span>{prop.metadata.sqft.toLocaleString()} SQFT</span>
                        {prop.metadata.cap_rate && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-emerald-400 font-black">{prop.metadata.cap_rate}% CAP</span>
                          </>
                        )}
                      </div>

                      {prop.intake_notes && (
                        <p className="text-[11px] text-zinc-400 italic">
                          Field Agent Note: "{prop.intake_notes}"
                        </p>
                      )}
                      {prop.owner && (
                        <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                          Owner account: {prop.owner.name} • {prop.owner.accountStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Agent Attribution & Action Controls */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <div className="flex items-center gap-2 mr-3">
                      <img
                        src={prop.agent.avatar}
                        alt={prop.agent.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white uppercase">{prop.agent.name}</span>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">{prop.agent.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewProperty(prop)}
                        className="p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
                        title="View Full Inspection Deck"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {prop.status !== 'Approved' && (
                        <button
                          onClick={() => onUpdatePropertyStatus(prop.id, 'Approved')}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}

                      {prop.status !== 'Needs_Revision' && (
                        <button
                          onClick={() => onUpdatePropertyStatus(prop.id, 'Needs_Revision')}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Revision</span>
                        </button>
                      )}

                      {prop.status === 'Approved' && (
                        <button
                          onClick={() => onUpdatePropertyStatus(prop.id, 'Pending')}
                          className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-zinc-900 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10"
                        >
                          To Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & GEOSPATIAL ANALYTICS */}
      {crmTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classification Distribution: Invest vs Live */}
          <div className="p-6 bg-black border border-white/10 shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4 flex items-center justify-between">
              <span>Inventory Allocation</span>
              <span className="text-[10px] text-zinc-500 font-mono">TANZANIA CADASTRE</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Investment Portfolio ({investProperties.length})
                  </span>
                  <span className="font-mono text-white font-bold">
                    {Math.round((investProperties.length / properties.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(investProperties.length / properties.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-500 font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Residential Luxury ({properties.length - investProperties.length})
                  </span>
                  <span className="font-mono text-white font-bold">
                    {Math.round(((properties.length - investProperties.length) / properties.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-400 h-full"
                    style={{
                      width: `${((properties.length - investProperties.length) / properties.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="p-4 bg-[#0A0A0A] border border-white/5">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono tracking-wider">Median Portfolio Price</span>
                <span className="text-xl font-black text-white font-mono">
                  {formatCurrency(totalValuation / (approvedListings.length || 1))}
                </span>
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-white/5">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono tracking-wider">Projected Annual Yield</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {formatCurrency(totalValuation * (avgCapRate / 100))}
                </span>
              </div>
            </div>
          </div>

          {/* Regional Hub Breakdown */}
          <div className="p-6 bg-black border border-white/10 shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
              Geographic Inventory Distribution
            </h4>

            <div className="space-y-3">
              {['Dar es Salaam', 'Zanzibar', 'Arusha', 'Kilimanjaro', 'Serengeti', 'Dodoma'].map((city) => {
                const count = properties.filter((p) => p.location.city.toLowerCase().includes(city.toLowerCase())).length;
                return (
                  <div key={city} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                    <span className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      {city}, Tanzania
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#0A0A0A] border border-white/10 text-white">
                        {count} {count === 1 ? 'LISTING' : 'LISTINGS'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT LEADS PIPELINE */}
      {crmTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-black border border-white/10 text-xs">
              {(['All', 'New', 'Contacted', 'Tour_Scheduled', 'Offer_Placed', 'Closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setLeadFilter(status)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    leadFilter === status
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-500 uppercase">
              Showing {displayLeads.length} investor inquiries
            </span>
          </div>

          {displayLeads.length === 0 ? (
            <div className="text-center py-16 p-8 bg-black border border-white/10">
              <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h4 className="text-base font-black italic uppercase tracking-tight text-white mb-1">No Inquiries Found</h4>
              <p className="text-xs text-zinc-500 font-mono uppercase">No leads in the "{leadFilter}" category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-6 bg-black border border-white/10 hover:border-red-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          lead.status === 'New'
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : lead.status === 'Tour_Scheduled'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : lead.status === 'Offer_Placed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#0A0A0A] border border-white/10 text-zinc-400">
                        {lead.intent} • {lead.inquiry_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Target: <strong className="text-white uppercase font-bold">{lead.property_title || 'General Portfolio'}</strong>
                      </span>
                    </div>

                    <h4 className="font-black italic text-white text-lg uppercase tracking-tight">
                      {lead.client_name}
                    </h4>

                    <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                      "{lead.message}"
                    </p>

                    <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1 font-mono">
                      <a href={`tel:${lead.client_phone}`} className="flex items-center gap-1 hover:text-white">
                        <Phone className="w-3 h-3 text-red-500" />
                        <span>{lead.client_phone}</span>
                      </a>
                      <a href={`mailto:${lead.client_email}`} className="flex items-center gap-1 hover:text-white">
                        <Mail className="w-3 h-3 text-red-500" />
                        <span>{lead.client_email}</span>
                      </a>
                      {lead.preferred_date && (
                        <span className="flex items-center gap-1 text-zinc-300">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>REQ: {new Date(lead.preferred_date).toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Advance Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="px-3 py-2.5 bg-[#0A0A0A] border border-white/10 text-xs font-bold text-white uppercase tracking-wider focus:border-red-600 focus:outline-none"
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Tour_Scheduled">Status: Tour Scheduled</option>
                      <option value="Offer_Placed">Status: Offer Placed</option>
                      <option value="Closed">Status: Closed Deal</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
