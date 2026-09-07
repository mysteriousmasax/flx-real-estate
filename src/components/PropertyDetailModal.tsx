import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Property, Lead } from '../types';
import { InvestmentCalculator } from './InvestmentCalculator';
import { PropertyQrModal } from './PropertyQrModal';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  MapPin, 
  TrendingUp, 
  Home, 
  Calendar, 
  Calculator, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Share2,
  Heart,
  QrCode,
  Copy,
  Check,
  Download,
  Printer,
  Smartphone,
  Globe,
  MessageSquare
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'created_at' | 'status'>) => void;
  isSaved?: boolean;
  onToggleSave: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onAddLead,
  isSaved = false,
  onToggleSave,
}) => {
  if (!property) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos'>('video');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'calculator' | 'tour' | 'qrcode'>('overview');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // QR Code preview in Tab 4
  const [tabQrUrl, setTabQrUrl] = useState<string>('');
  const [tabQrCopied, setTabQrCopied] = useState<boolean>(false);

  useEffect(() => {
    if (property) {
      const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${window.location.pathname}?property=${encodeURIComponent(property.id)}`
        : '';
      QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' }
      }).then(setTabQrUrl).catch(console.error);
    }
  }, [property]);

  // VIP Tour & Inquire Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'Tour' | 'Investor_Deck' | 'Make_Offer'>('Tour');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submittedLead, setSubmittedLead] = useState(false);
  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [sendGmailBrochure, setSendGmailBrochure] = useState(true);

  const { schedulePropertyTour, sendPropertyBrochure, openWorkspaceModal } = useWorkspace();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    onAddLead({
      property_id: property.id,
      property_title: property.title,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone || '+1 (555) 000-0000',
      inquiry_type: inquiryType,
      preferred_date: preferredDate,
      message: message || `Inquiring about ${property.title} listed at ${formatCurrency(property.price)}`,
    });

    // Google Calendar Sync
    if (syncToCalendar && preferredDate) {
      schedulePropertyTour(
        property,
        clientName,
        clientEmail,
        preferredDate,
        message || 'VIP estate inspection coordinated via FLX Private Client Services.'
      );
    }

    // Gmail Brochure Dispatch
    if (sendGmailBrochure) {
      sendPropertyBrochure(
        property,
        clientEmail,
        `Dear ${clientName}, here is the executive acquisition portfolio for ${property.title}.`
      );
    }

    setSubmittedLead(true);
    setTimeout(() => {
      setSubmittedLead(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0A0A0A] border border-red-600/50 shadow-[0_0_80px_rgba(220,38,38,0.35)] overflow-hidden my-auto">
        
        {/* Top Technical Status Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em] border ${
                property.property_type === 'Invest'
                  ? 'bg-emerald-950 border-emerald-500/80 text-emerald-300'
                  : 'bg-red-950 border-red-600 text-red-300'
              }`}
            >
              FLX // {property.property_type}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 bg-red-600 animate-pulse rounded-full" />
                <span className="text-[9px] uppercase tracking-[0.35em] font-black text-red-500">
                  Live Now / Geotagged Listing
                </span>
              </div>
              <h2 className="font-headline text-xl sm:text-2xl font-black italic tracking-tighter text-white line-clamp-1">
                {property.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-modal-qr-pass"
              onClick={() => setShowQrModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:brightness-110 active:scale-95 border border-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all rounded"
              title="Generate Walk-in Client QR Code"
            >
              <QrCode className="w-4 h-4 text-white shrink-0 animate-pulse" />
              <span className="hidden sm:inline">WALK-IN QR PASS</span>
            </button>

            <button
              onClick={() => onToggleSave(property.id)}
              className="p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-red-500 transition-colors rounded"
              title="Save Estate"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Cinema Deck: Video vs Photo Gallery Switcher */}
        <div className="relative bg-black">
          {activeMediaTab === 'video' ? (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[460px] w-full overflow-hidden bg-black flex items-center justify-center">
              <video
                src={property.video_url}
                poster={property.thumbnail_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/90 backdrop-blur-md border border-red-600 text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span>MUX CDN // {property.video_resolution || '4K 60FPS STREAM'}</span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[460px] w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={property.images[selectedPhotoIndex] || property.thumbnail_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 z-10 overflow-x-auto py-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-16 h-10 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedPhotoIndex === idx ? 'border-red-600 scale-105' : 'border-white/20 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Switcher Buttons */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center bg-black/90 backdrop-blur-md p-1 border border-white/10">
            <button
              onClick={() => setActiveMediaTab('video')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] transition-all ${
                activeMediaTab === 'video'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cinematic Video
            </button>
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] transition-all ${
                activeMediaTab === 'photos'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Gallery ({property.images.length})
            </button>
          </div>
        </div>

        {/* Price & Primary Specs Strip */}
        <div className="px-6 py-4 bg-black border-b border-white/10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black block">Valuation</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {formatCurrency(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 text-sm">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Spatial Specs</span>
              <span className="font-mono font-bold text-white text-base">
                {property.metadata.beds} BEDS / {property.metadata.baths} BATHS
              </span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-8">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Footprint</span>
              <span className="font-mono font-bold text-white text-base">{property.metadata.sqft.toLocaleString()} SQFT</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-8">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Coordinates</span>
              <span className="font-mono text-xs text-zinc-300">
                {Math.abs(property.location.lat).toFixed(4)}° S, {Math.abs(property.location.lng).toFixed(4)}° E
              </span>
            </div>
            {property.metadata.cap_rate && (
              <div className="flex flex-col border-l border-white/10 pl-4 sm:pl-8">
                <span className="text-[9px] text-emerald-400 uppercase tracking-[0.2em] font-black">Yield ROI</span>
                <span className="font-mono font-black text-emerald-400 text-base">{property.metadata.cap_rate}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation: Overview | Investment Calculator | VIP Tour Booking */}
        <div className="px-6 border-b border-white/10 bg-[#0A0A0A] flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.25em]">
          <button
            onClick={() => setActiveDetailTab('overview')}
            className={`py-4 border-b-2 transition-all ${
              activeDetailTab === 'overview'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            Overview & Finishes
          </button>
          <button
            onClick={() => setActiveDetailTab('calculator')}
            className={`flex items-center gap-1.5 py-4 border-b-2 transition-all ${
              activeDetailTab === 'calculator'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Investment Calculator</span>
          </button>
          <button
            onClick={() => setActiveDetailTab('tour')}
            className={`flex items-center gap-1.5 py-4 border-b-2 transition-all ${
              activeDetailTab === 'tour'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span>VIP Private Showing</span>
          </button>
          <button
            id="tab-property-qr-pass"
            onClick={() => setActiveDetailTab('qrcode')}
            className={`flex items-center gap-1.5 py-4 border-b-2 transition-all ${
              activeDetailTab === 'qrcode'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-red-500" />
            <span>Walk-in Client QR</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[440px] overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Description & Finishes */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="text-base font-black italic uppercase tracking-tighter text-white mb-2">
                    Property Narrative
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {property.metadata.luxury_finishes && (
                  <div>
                    <h4 className="text-base font-black italic uppercase tracking-tighter text-white mb-3">
                      Architectural Specs & Luxury Finishes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {property.metadata.luxury_finishes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3 bg-black border border-white/10 text-xs text-zinc-200">
                          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-semibold uppercase tracking-wider text-[11px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Spec Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black border border-white/10 text-xs">
                  <div className="border-r border-white/5 pr-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 block mb-1">Year Built</span>
                    <strong className="text-white font-mono text-sm">{property.metadata.year_built || '2024'}</strong>
                  </div>
                  <div className="border-r border-white/5 pr-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 block mb-1">Lot Dimensions</span>
                    <strong className="text-white font-mono text-sm">{property.metadata.lot_size || 'N/A'}</strong>
                  </div>
                  <div className="border-r border-white/5 pr-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 block mb-1">Monthly HOA</span>
                    <strong className="text-white font-mono text-sm">${property.metadata.hoa_monthly || 0}/MO</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500 block mb-1">WalkScore</span>
                    <strong className="text-emerald-400 font-mono text-sm">{property.metadata.walk_score || 85}/100</strong>
                  </div>
                </div>
              </div>

              {/* Right Col: Listing Agent Card */}
              <div className="p-5 bg-black border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 bg-red-600 animate-pulse rounded-full" />
                    <span className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black">
                      Exclusive FLX Broker
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-14 h-14 object-cover border-2 border-red-600 shadow-md"
                    />
                    <div>
                      <h5 className="font-black italic text-lg text-white tracking-tight">{property.agent.name}</h5>
                      <span className="text-xs text-red-500 font-bold uppercase tracking-wider block">{property.agent.role}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">LIC // {property.agent.license}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-300">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-2.5 p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-mono">{property.agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-2.5 p-2.5 bg-[#0A0A0A] hover:bg-zinc-900 border border-white/10 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span className="truncate font-mono">{property.agent.email}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    id="btn-agent-card-qr"
                    onClick={() => setShowQrModal(true)}
                    className="mt-4 w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded"
                  >
                    <QrCode className="w-3.5 h-3.5 text-red-500" />
                    <span>Walk-In Client QR Pass</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveDetailTab('tour')}
                  className="mt-4 w-full py-3.5 px-4 bg-gradient-to-r from-red-700 to-red-900 text-white font-black text-xs uppercase tracking-[0.25em] hover:brightness-110 border border-red-600/50 shadow-lg transition-all"
                >
                  Direct Inquiry to Agent
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INVESTMENT CALCULATOR (TANZANIA MARKET TRENDS & YIELDS) */}
          {activeDetailTab === 'calculator' && (
            <InvestmentCalculator
              property={property}
              onInquireInvestment={() => setActiveDetailTab('tour')}
            />
          )}

          {/* TAB 3: SCHEDULE PRIVATE SHOWING / INQUIRE */}
          {activeDetailTab === 'tour' && (
            <div className="max-w-2xl mx-auto">
              {submittedLead ? (
                <div className="text-center py-12 p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 animate-in zoom-in-95">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="font-headline text-xl font-black italic uppercase tracking-tight text-white mb-2">
                    Inquiry Transmitted to FLX Partner Desk
                  </h3>
                  <p className="text-sm text-neutral-300">
                    Your request for <strong>{property.title}</strong> has been logged directly into the CRM pipeline. An associate broker will reach out within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} className="space-y-4 p-6 rounded-2xl bg-[#14161b] border border-white/10 shadow-xl">
                  <div className="text-center mb-4">
                    <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Private Client Services</span>
                    <h3 className="font-headline text-lg font-black italic uppercase tracking-tight text-white">Book VIP Tour or Request Investment Packet</h3>
                  </div>

                  {/* Inquiry Type Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['Tour', 'Investor_Deck', 'Make_Offer'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInquiryType(type)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          inquiryType === type
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-[#0c0d10] text-neutral-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {type === 'Tour' ? 'Private Tour' : type === 'Investor_Deck' ? 'Full Pro-Forma' : 'Draft Offer'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Sterling Hayes"
                        className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="s.hayes@capital.com"
                        className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Mobile Contact Phone</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Preferred Showing Window</label>
                      <input
                        type="datetime-local"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Confidential Notes / Acquisition Criteria</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify timing, 1031 exchange requirements, or private chauffeur/boat arrival preferences..."
                      className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Google Workspace Automations */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Google Workspace Sync Options
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">mysteriousmasax@gmail.com</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncToCalendar}
                          onChange={(e) => setSyncToCalendar(e.target.checked)}
                          className="rounded border-white/20 bg-black text-blue-600 focus:ring-0"
                        />
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          Add Tour to Google Calendar
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sendGmailBrochure}
                          onChange={(e) => setSendGmailBrochure(e.target.checked)}
                          className="rounded border-white/20 bg-black text-red-600 focus:ring-0"
                        />
                        <span className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-red-400" />
                          Dispatch PDF Dossier via Gmail
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-red-900/50 transition-all"
                  >
                    Submit Confidential VIP Request
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: WALK-IN CLIENT QR CODE PASS */}
          {activeDetailTab === 'qrcode' && (
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-[#0a0a0c] border border-red-600/30 rounded-2xl shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-500 font-bold">
                      FLX SHOWROOM DESK TOOL
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-black text-white uppercase tracking-tight">
                    Walk-In Client Instant Link Pass
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Client points their mobile camera to immediately stream the 4K walkthrough and full spatial dossier.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand Full Screen</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-black/60 border border-white/10 rounded-xl">
                {/* QR Display */}
                <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-zinc-800 shrink-0 text-center">
                  {tabQrUrl ? (
                    <img 
                      src={tabQrUrl} 
                      alt="Property QR" 
                      className="w-44 h-44 object-contain rounded" 
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-zinc-100">
                      <QrCode className="w-8 h-8 text-zinc-400 animate-spin" />
                    </div>
                  )}
                  <span className="text-[9px] font-mono font-black text-black uppercase tracking-widest block mt-1.5">
                    SCAN CAMERA • NO APP
                  </span>
                </div>

                {/* Specs & Link */}
                <div className="flex-1 space-y-3 min-w-0 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                      Direct Estate Payload
                    </span>
                    <h4 className="font-headline text-base font-black text-white line-clamp-1">
                      {property.title}
                    </h4>
                    <p className="text-xs text-zinc-300 font-mono mt-0.5">
                      ${property.price.toLocaleString()} USD • {property.metadata.beds} Bed • {property.metadata.sqft.toLocaleString()} SqFt
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      📍 {property.location.ward || property.location.district || property.location.city}, {property.location.region || 'Tanzania'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                      Scanned URL:
                    </span>
                    <p className="font-mono text-[11px] text-zinc-200 truncate select-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?property=${encodeURIComponent(property.id)}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      id="btn-tab-copy-link"
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}?property=${encodeURIComponent(property.id)}`;
                        navigator.clipboard.writeText(url);
                        setTabQrCopied(true);
                        setTimeout(() => setTabQrCopied(false), 2000);
                      }}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      {tabQrCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      id="btn-tab-open-qr-modal"
                      onClick={() => setShowQrModal(true)}
                      className="px-3 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print / Download Desk Badge</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Impact Dedicated Walk-In Client QR Modal */}
      <PropertyQrModal
        property={property}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
