import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Property } from '../types';
import { 
  QrCode, 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Share2, 
  ExternalLink, 
  MessageSquare, 
  Globe, 
  Smartphone, 
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Maximize2
} from 'lucide-react';

interface PropertyQrModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

type QrTargetType = 'listing' | 'whatsapp' | 'video';

export const PropertyQrModal: React.FC<PropertyQrModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [qrTarget, setQrTarget] = useState<QrTargetType>('listing');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute shareable URL
  const getListingUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin || '';
    const pathname = window.location.pathname || '';
    return `${origin}${pathname}?property=${encodeURIComponent(property.id)}`;
  };

  const getVideoUrl = () => {
    return property.video_url || getListingUrl();
  };

  const getWhatsAppUrl = () => {
    const rawPhone = property.agent.phone.replace(/[^0-9]/g, '');
    const phone = rawPhone.startsWith('0') ? `255${rawPhone.slice(1)}` : (rawPhone.startsWith('255') ? rawPhone : `255${rawPhone}`);
    const message = `Habari ${property.agent.name}, I am at the FLX showroom viewing "${property.title}" (Ref: ${property.id}). Please share the official property brochure and price breakdown.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Determine current payload based on selected QR target
  const getActivePayload = () => {
    switch (qrTarget) {
      case 'whatsapp':
        return getWhatsAppUrl();
      case 'video':
        return getVideoUrl();
      case 'listing':
      default:
        return getListingUrl();
    }
  };

  const currentPayload = getActivePayload();

  // Generate QR Code data URL whenever target or property changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    const payload = getActivePayload();

    QRCode.toDataURL(payload, {
      width: 420,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#050505',
        light: '#FFFFFF'
      }
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed generating QR code:', err);
        if (isMounted) {
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, qrTarget, property.id]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentPayload);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleDownloadQrBadge = () => {
    if (!qrDataUrl) return;

    // Create high-res canvas with FLX branding frame
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1050);
    grad.addColorStop(0, '#0a0a0c');
    grad.addColorStop(1, '#050505');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1050);

    // Border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 1010);

    // Header: FLX Brand
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLX LUXURY REAL ESTATE', 400, 80);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TANZANIA CADASTRE // WALK-IN CLIENT PASS', 400, 115);

    // Property Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    const cleanTitle = property.title.length > 38 ? property.title.slice(0, 35) + '...' : property.title;
    ctx.fillText(cleanTitle, 400, 165);

    // Location & Valuation
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`$${property.price.toLocaleString()} USD`, 400, 205);

    const locText = `${property.location.ward || ''}, ${property.location.district || ''}, ${property.location.city || 'Tanzania'}`.trim();
    ctx.fillStyle = '#d4d4d8';
    ctx.font = '16px sans-serif';
    ctx.fillText(locText, 400, 240);

    // Draw QR code container (white card)
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(175, 275, 450, 450, 16);
    ctx.fill();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 200, 300, 400, 400);

      // Footer Info
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SCAN WITH ANY SMARTPHONE CAMERA', 400, 780);

      ctx.fillStyle = '#71717a';
      ctx.font = '14px sans-serif';
      ctx.fillText('Direct 4K Video Tour • Spatial Cadastre • Investment Yields', 400, 810);

      // Agent Details
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 850);
      ctx.lineTo(700, 850);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Exclusive Agent: ${property.agent.name}`, 400, 895);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`TEL: ${property.agent.phone}  •  LIC: ${property.agent.license}`, 400, 930);

      ctx.fillStyle = '#52525b';
      ctx.font = '12px monospace';
      ctx.fillText(`REF: ${property.id}  •  GEO: ${property.location.lat.toFixed(4)}° S, ${property.location.lng.toFixed(4)}° E`, 400, 980);

      // Trigger download
      const link = document.createElement('a');
      link.download = `FLX-${property.id}-WalkIn-QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const handlePrintDeskSign = () => {
    window.print();
  };

  const handleWebShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Explore "${property.title}" in ${property.location.city}, Tanzania ($${property.price.toLocaleString()} USD)`,
          url: currentPayload
        });
      } catch (e) {
        console.log('Share dismissed or cancelled:', e);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#0d0f12] border border-red-600/40 shadow-[0_0_60px_rgba(220,38,38,0.25)] rounded-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/40 via-black to-zinc-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500">
              <QrCode className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold">
                  FLX AGENT TOOLKIT // WALK-IN PASS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-zinc-300">
                  REF #{property.id}
                </span>
              </div>
              <h3 className="font-headline text-lg font-black text-white tracking-tight uppercase">
                Instant Walk-In Client QR Code
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Target Payload Selector Tabs */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 font-bold">
              Select Link Destination for Walk-In Client:
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/60 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setQrTarget('listing')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  qrTarget === 'listing'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Full Listing</span>
              </button>

              <button
                type="button"
                onClick={() => setQrTarget('whatsapp')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  qrTarget === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Agent</span>
              </button>

              <button
                type="button"
                onClick={() => setQrTarget('video')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  qrTarget === 'video'
                    ? 'bg-zinc-100 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>4K Video Tour</span>
              </button>
            </div>
          </div>

          {/* QR Code Presentation Box (High-contrast for quick camera focus) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#07080a] border border-white/10 rounded-2xl">
            {/* The QR Card container */}
            <div className="relative group shrink-0">
              <div className="p-3.5 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center border-4 border-zinc-900">
                {isGenerating ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center bg-zinc-100 rounded-lg">
                    <QrCode className="w-12 h-12 text-zinc-400 animate-spin" />
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${property.title}`}
                    className="w-[180px] h-[180px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-red-500">
                    Failed to render QR
                  </div>
                )}
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-black tracking-widest text-zinc-900 uppercase font-mono block">
                    FLX // SCAN TO OPEN
                  </span>
                </div>
              </div>

              {/* Scanning Corner Guides */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none" />
            </div>

            {/* Property Summary & Instructions */}
            <div className="flex-1 min-w-0 space-y-3 text-left">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready For Client Scanning
                </span>
                <h4 className="font-headline text-base font-black text-white tracking-tight line-clamp-1">
                  {property.title}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  ${property.price.toLocaleString()} USD • {property.metadata.beds} Bed / {property.metadata.baths} Bath
                </p>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  📍 {property.location.ward ? `${property.location.ward}, ` : ''}{property.location.district || property.location.city}, {property.location.region || 'Tanzania'}
                </p>
              </div>

              {/* Scan explanation badge */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-[11px]">
                  <Smartphone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>No mobile app or sign-up needed</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5 leading-relaxed">
                  Have the client point their iPhone or Android camera at this code. The digital brochure, 4K walkthrough, and financial pro-forma will load immediately.
                </p>
              </div>

              {/* Agent direct reference */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                <span>Broker: <strong className="text-zinc-200">{property.agent.name}</strong></span>
                <span>{property.agent.phone}</span>
              </div>
            </div>
          </div>

          {/* Deep link display with quick copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Direct Scanned Link:</span>
              <span className="text-[10px] font-mono text-red-400 truncate max-w-[240px]">
                {currentPayload}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentPayload}
                className="flex-1 px-3 py-2 bg-black border border-white/10 text-xs font-mono text-zinc-300 rounded-lg focus:outline-none select-all"
              />
              <button
                type="button"
                id="btn-copy-qr-link"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Agent Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            {/* Download Badge */}
            <button
              type="button"
              id="btn-download-qr-badge"
              onClick={handleDownloadQrBadge}
              className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
            >
              <Download className="w-4 h-4" />
              <span>Download Badge</span>
            </button>

            {/* Print Desk Tent */}
            <button
              type="button"
              id="btn-print-qr-flyer"
              onClick={handlePrintDeskSign}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <Printer className="w-4 h-4" />
              <span>Print Desk Card</span>
            </button>

            {/* Native Share */}
            <button
              type="button"
              id="btn-native-share"
              onClick={handleWebShare}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <Share2 className="w-4 h-4 text-red-500" />
              <span>Beam / AirDrop</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified FLX Tanzania Cadastre Deep Link
          </span>
          <span>HIGH-RES ERROR CORRECTION H-GRADE</span>
        </div>
      </div>
    </div>
  );
};
