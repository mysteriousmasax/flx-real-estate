import React, { useState, useEffect } from 'react';
import { Property, PropertyType, AgentInfo } from '../types';
import { TEAM_AGENTS } from '../data/mockProperties';
import { IntakeLocationPicker } from './IntakeLocationPicker';
import { findNearestTanzaniaStreet } from '../data/tanzaniaLocations';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, 
  MapPin, 
  Video, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Home, 
  Compass, 
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  ShieldAlert,
  Film,
  Crosshair
} from 'lucide-react';

interface AgentIntakePortalProps {
  onPropertySubmit: (property: Property) => void;
  onNavigateToDiscovery: (propertyId?: string) => void;
}

export const AgentIntakePortal: React.FC<AgentIntakePortalProps> = ({
  onPropertySubmit,
  onNavigateToDiscovery,
}) => {
  const { user, openAuthModal } = useAuth();

  // GPS State
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy?: number }>({
    lat: -6.7495,
    lng: 39.2782,
    accuracy: 5,
  });
  const [gpsStatus, setGpsStatus] = useState<string>('Standby - Tap Snap to acquire GPS coordinates');

  // Video and Transcode State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [transcodingState, setTranscodingState] = useState<'idle' | 'uploading' | 'transcoding' | 'ready'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Form Fields - Tanzania Cadastre
  const [title, setTitle] = useState<string>('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Invest');
  const [price, setPrice] = useState<number>(3500000);
  const [address, setAddress] = useState<string>('14 Toure Drive, Plot 28');
  const [ward, setWard] = useState<string>('Masaki');
  const [district, setDistrict] = useState<string>('Kinondoni');
  const [region, setRegion] = useState<string>('Dar es Salaam');
  const [city, setCity] = useState<string>('Dar es Salaam');
  const [state, setState] = useState<string>('Tanzania');
  const [zip, setZip] = useState<string>('14111');
  const [beds, setBeds] = useState<number>(4);
  const [baths, setBaths] = useState<number>(4.5);
  const [sqft, setSqft] = useState<number>(4200);
  const [capRate, setCapRate] = useState<number>(8.8);
  const [monthlyRent, setMonthlyRent] = useState<number>(28000);
  const [description, setDescription] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(TEAM_AGENTS[0].id);
  const [intakeNotes, setIntakeNotes] = useState<string>('Captured onsite via mobile drone gimbal rig in Dar es Salaam. Verified Tanzanian title deed.');
  const [luxuryFinishes, setLuxuryFinishes] = useState<string>('Indian Ocean View, Mvule Hardwood, Crestron Automation, Standby Generator, Swimming Pool');

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);

  // Auto-fetch GPS on component mount
  useEffect(() => {
    handleSnapToCurrentLocation();
  }, []);

  // Dedicated Snap to Current Device Location using Geolocation API
  const handleSnapToCurrentLocation = () => {
    setGpsLoading(true);
    setGpsStatus('Requesting device position via Geolocation API...');

    if (!navigator.geolocation) {
      setGpsStatus('Geolocation API not supported by this browser. Using Dar es Salaam fallback.');
      setGpsCoords({ lat: -6.7495, lng: 39.2782, accuracy: 5 });
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const roundedAcc = Math.round(accuracy);
        setGpsCoords({ lat: latitude, lng: longitude, accuracy: roundedAcc });

        // Reverse match closest registered street in Tanzania
        const nearest = findNearestTanzaniaStreet(latitude, longitude);
        if (nearest) {
          setAddress(nearest.name);
          setWard(nearest.ward);
          setDistrict(nearest.district);
          setCity(nearest.city);
          setRegion(nearest.region);
          setZip(nearest.postalCode);
          setGpsStatus(`📍 Snapped to Device GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${roundedAcc}m) • Matched to ${nearest.name}, ${nearest.ward}`);
        } else {
          setGpsStatus(`📍 Snapped to Device GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${roundedAcc}m)`);
        }
        setGpsLoading(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.code, error.message);
        let errorMsg = 'GPS acquisition unavailable';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user/browser. Tap button to retry or edit coordinates manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS satellite fix timed out. Using default luxury hub fallback (-6.7495, 39.2782).';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Position unavailable from device GNSS. Using luxury hub fallback (-6.7495, 39.2782).';
        } else {
          errorMsg = `GPS Notice: ${error.message}. Using Masaki, Dar es Salaam fallback.`;
        }
        // Seamless fallback to premier hub so agent is never stranded
        setGpsCoords({ lat: -6.7495, lng: 39.2782, accuracy: 6 });
        setGpsStatus(errorMsg);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Video selection & Mux transcode simulation
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      simulateMuxTranscode();
    } else {
      // Default sample video if user cancels
      useDefaultSampleTour();
    }
  };

  const useDefaultSampleTour = () => {
    setVideoPreviewUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    simulateMuxTranscode();
  };

  const simulateMuxTranscode = () => {
    setTranscodingState('uploading');
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTranscodingState('transcoding');
          setTimeout(() => {
            setTranscodingState('ready');
          }, 1200);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const baseAgent = TEAM_AGENTS.find((a) => a.id === selectedAgentId) || TEAM_AGENTS[0];
    const agent: AgentInfo = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: baseAgent.phone,
          license: 'TZ-BRELA-GOOG-2024',
          role: 'Verified Google Intake Agent',
          avatar: user.picture || baseAgent.avatar,
        }
      : baseAgent;
    const propertyId = `prop-flx-${Date.now()}`;

    const newProperty: Property = {
      id: propertyId,
      created_at: new Date().toISOString(),
      title: title || `${ward ? ward + ', ' : ''}${city} Modern ${propertyType === 'Invest' ? 'Investment Haven' : 'Architectural Estate'}`,
      property_type: propertyType,
      status: 'Pending', // Pushed into Admin approval queue
      price: Number(price),
      video_url: videoPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_resolution: '4K MUX CDN',
      thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ],
      location: {
        lat: gpsCoords.lat,
        lng: gpsCoords.lng,
        address: address || '14 Toure Drive, Plot 28',
        ward: ward,
        district: district,
        region: region,
        city: city || 'Dar es Salaam',
        state: region || 'Tanzania',
        zip: zip || '14111',
        neighborhood: `${ward}, ${district} • ${region}, Tanzania`,
      },
      agent: agent,
      metadata: {
        beds: Number(beds),
        baths: Number(baths),
        sqft: Number(sqft),
        year_built: 2024,
        cap_rate: propertyType === 'Invest' ? Number(capRate) : undefined,
        gross_yield: propertyType === 'Invest' ? Number(capRate) * 1.3 : undefined,
        projected_monthly_rent: Number(monthlyRent),
        projected_annual_cashflow: Number(monthlyRent) * 12 * 0.65,
        occupancy_rate: 95,
        short_term_rental_allowed: true,
        luxury_finishes: luxuryFinishes.split(',').map((s) => s.trim()).filter(Boolean),
        walk_score: 85,
        school_rating: 9,
      },
      description: description || `Newly captured onsite via FLX Field Intake. Outstanding high-yield luxury estate featuring state-of-the-art construction, panoramic perspectives, and turnkey high-performance capabilities.`,
      intake_notes: intakeNotes,
    };

    setTimeout(() => {
      onPropertySubmit(newProperty);
      setSubmittedProperty(newProperty);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Success View */}
      {submittedProperty ? (
        <div className="p-8 sm:p-10 bg-black border-2 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.35)] text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-600 flex items-center justify-center mx-auto mb-4 text-red-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.35em] block mb-1">
            FLX INTAKE PIPELINE COMPLETE
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-black italic tracking-tighter text-white mb-2 uppercase">
            Estate Geotagged & Queued for Approval
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-6">
            <strong>{submittedProperty.title}</strong> has been saved with PostGIS coordinates (
            <span className="font-mono text-white">{submittedProperty.location.lat.toFixed(4)}, {submittedProperty.location.lng.toFixed(4)}</span>
            ). The listing is now live in the <strong>Admin CRM Review Queue</strong> awaiting executive sign-off.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigateToDiscovery(submittedProperty.id)}
              className="px-6 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white font-black text-xs uppercase tracking-[0.25em] hover:brightness-110 border border-red-600/50 shadow-lg"
            >
              View on Discovery Map
            </button>
            <button
              onClick={() => {
                setSubmittedProperty(null);
                setTitle('');
                setVideoPreviewUrl('');
                setTranscodingState('idle');
              }}
              className="px-6 py-4 bg-black hover:bg-zinc-900 border border-white/10 text-white font-black text-xs uppercase tracking-[0.25em]"
            >
              Upload Another Listing
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-black border border-white/10 p-6 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.35em]">
                  FLX FIELD AGENT PORTAL
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-black italic text-white tracking-tighter uppercase">
                NEW ON-SITE ESTATE INTAKE
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] border border-white/10 text-xs font-mono text-zinc-300">
              <Compass className="w-3.5 h-3.5 text-red-500" />
              <span className="uppercase tracking-wider">PostGIS 4326 Active</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google Authentication Agent Ribbon */}
            <div className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 bg-[#0d0f14] border-white/10">
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{user.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-mono uppercase tracking-wider bg-emerald-950 border border-emerald-500/50 text-emerald-400">
                          Google Verified Agent
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">{user.email} • Listings auto-credited</div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Google Field Agent Sign-In</div>
                      <div className="text-[10px] text-zinc-400">Sign in to stamp submissions with your official Google credentials</div>
                    </div>
                  </div>
                )}
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>

            {/* 1. GEOSPATIAL CADASTRE & INTERACTIVE ESTATE PICKER (Tanzania Streets & Satellite Map) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0f1115] border border-red-500/30 shadow-lg">
              <IntakeLocationPicker
                currentCoords={gpsCoords}
                onCoordsChange={(coords) => setGpsCoords(coords)}
                address={address}
                setAddress={setAddress}
                ward={ward}
                setWard={setWard}
                district={district}
                setDistrict={setDistrict}
                city={city}
                setCity={setCity}
                region={region}
                setRegion={setRegion}
                zip={zip}
                setZip={setZip}
                gpsStatus={gpsStatus}
                setGpsStatus={setGpsStatus}
                gpsLoading={gpsLoading}
                onSnapToCurrentLocation={handleSnapToCurrentLocation}
              />
            </div>

            {/* 2. VIDEO CAPTURE & MUX TRANSCODING ENGINE */}
            <div className="p-4 rounded-xl bg-[#0f1115] border border-white/10">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Video className="w-4 h-4 text-red-500" />
                <span>Cinematic Video Tour (Mux Video CDN)</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload / Capture input box */}
                <div className="flex flex-col justify-center items-center p-6 border-2 border-dashed border-white/15 hover:border-red-500/50 rounded-xl bg-black/40 text-center transition-colors">
                  <Film className="w-8 h-8 text-neutral-500 mb-2" />
                  <p className="text-xs font-bold text-white mb-1">Select 4K Video Tour File</p>
                  <p className="text-[10px] text-neutral-400 mb-4">MP4, MOV, or ProRes up to 2GB</p>
                  
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-all">
                    <span>Browse Device / Record</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={useDefaultSampleTour}
                    className="mt-2 text-[10px] text-neutral-400 hover:text-red-400 underline"
                  >
                    Or load verified 4K sample estate tour
                  </button>
                </div>

                {/* Transcoding Progress & Preview */}
                <div className="flex flex-col justify-between p-4 rounded-xl bg-black/60 border border-white/5">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-300 font-medium">Mux Ingestion Pipeline:</span>
                      <span className={`font-mono uppercase text-[10px] font-bold ${
                        transcodingState === 'ready' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {transcodingState === 'ready' ? 'Ready for Streaming' : transcodingState}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Video preview window */}
                  {videoPreviewUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                      <video
                        src={videoPreviewUrl}
                        controls
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-[#0a0c0e] border border-white/5 flex items-center justify-center text-xs text-neutral-500">
                      Video preview will appear after upload
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. PROPERTY METRICS & DETAILS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-neutral-400 block mb-1">Estate / Property Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Titanium Crest Sanctuary"
                    className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Type: Invest vs Live */}
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Primary Classification *</label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0c0d10] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPropertyType('Invest')}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        propertyType === 'Invest'
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Invest</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyType('Live')}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        propertyType === 'Live'
                          ? 'bg-red-950 border border-red-500 text-red-300'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Home className="w-3 h-3" />
                      <span>Live</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price, Beds, Baths, SqFt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Asking Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs sm:text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs sm:text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs sm:text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Living SqFt</label>
                  <input
                    type="number"
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs sm:text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Investment specific pro-forma fields */}
              {propertyType === 'Invest' && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  <div>
                    <label className="text-xs text-emerald-400 font-semibold block mb-1">
                      Projected Cap Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={capRate}
                      onChange={(e) => setCapRate(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-emerald-500/30 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-emerald-400 font-semibold block mb-1">
                      Target Monthly Rental Revenue ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-emerald-500/30 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Cadastre Location Summary Card */}
              <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{address}</span>
                      <span className="px-2 py-0.5 bg-red-950/80 text-red-400 text-[10px] font-mono border border-red-800/50">
                        {ward}, {district}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {region} ({city}) • Postcode: {zip} • Tanzania
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-mono text-zinc-400 text-right">
                    GPS: <span className="text-emerald-400">{gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Luxury finishes & Description */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Luxury Finishes & Specs (comma separated)</label>
                <input
                  type="text"
                  value={luxuryFinishes}
                  onChange={(e) => setLuxuryFinishes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Field Description & Narrative</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural provenance, zoning status, view corridors..."
                  className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Listing Agent Selector */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Assigned Field Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0c0d10] border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  {TEAM_AGENTS.map((agent) => (
                    <option key={agent.id} value={agent.id} className="bg-[#14161a]">
                      {agent.name} — {agent.role} ({agent.license})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button (Matches the prompt's "Finalize & Geotag" button) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full py-5 px-6 bg-gradient-to-r from-red-700 via-red-800 to-red-950 text-white uppercase font-black tracking-[0.3em] text-xs shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:brightness-110 active:scale-[0.99] border border-red-600 transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>COMMITTING GEOTAG TO POSTGIS...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>FINALIZE & GEOTAG LISTING</span>
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
