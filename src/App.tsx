import React, { useState, useEffect } from 'react';
import { Property, Lead, ActiveAppView, PropertyType, ApprovalStatus, LeadStatus } from './types';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from './data/mockProperties';
import { Header } from './components/Header';
import { DiscoveryEngine } from './components/DiscoveryEngine';
import { AgentIntakePortal } from './components/AgentIntakePortal';
import { AdminCrm } from './components/AdminCrm';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SavedEstatesModal } from './components/SavedEstatesModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { FlxLogo } from './components/FlxLogo';
import { Compass, Camera, ShieldCheck, Heart, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Initialize state with local storage fallback
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('flx_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing properties:', e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('flx_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing leads:', e);
      }
    }
    return INITIAL_LEADS;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('flx_saved_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing saved ids:', e);
      }
    }
    return ['prop-flx-001', 'prop-flx-002'];
  });

  const [activeView, setActiveView] = useState<ActiveAppView>('discovery');
  const [selectedType, setSelectedType] = useState<'All' | PropertyType>('All');
  const [activePropertyModal, setActivePropertyModal] = useState<Property | null>(null);
  const [savedModalOpen, setSavedModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('flx_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('flx_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('flx_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  // Deep linking: Automatically open Property Detail Modal when scanned via QR code (?property=id or #property=id)
  useEffect(() => {
    const handleCheckDeepLink = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryPropId = urlParams.get('property');
        const hashMatch = window.location.hash.match(/property=([^&]+)/);
        const targetId = queryPropId || (hashMatch ? hashMatch[1] : null);

        if (targetId) {
          const match = properties.find((p) => p.id === targetId);
          if (match) {
            setActivePropertyModal(match);
          }
        }
      } catch (err) {
        console.error('Error checking deep link for property:', err);
      }
    };

    handleCheckDeepLink();
    window.addEventListener('popstate', handleCheckDeepLink);
    window.addEventListener('hashchange', handleCheckDeepLink);

    return () => {
      window.removeEventListener('popstate', handleCheckDeepLink);
      window.removeEventListener('hashchange', handleCheckDeepLink);
    };
  }, [properties]);

  // Synchronize active property modal with browser URL query parameter for seamless sharing
  const handleOpenPropertyModal = (prop: Property) => {
    setActivePropertyModal(prop);
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('property', prop.id);
      window.history.replaceState(null, '', newUrl.toString());
    } catch (e) {
      console.warn('Could not update URL history:', e);
    }
  };

  const handleClosePropertyModal = () => {
    setActivePropertyModal(null);
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('property');
      window.history.replaceState(null, '', newUrl.pathname + (newUrl.search ? newUrl.search : ''));
    } catch (e) {
      console.warn('Could not clean URL history:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Property Submission from Agent Intake
  const handlePropertySubmit = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`New Listing "${newProp.title}" Geotagged & submitted to Admin Queue.`);
  };

  // Approval status change from Admin CRM
  const handleUpdatePropertyStatus = (propertyId: string, status: ApprovalStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status } : p))
    );
    showToast(`Listing status updated to ${status}.`);
  };

  // Lead status change from Admin CRM
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    showToast(`Inquiry pipeline updated to ${status}.`);
  };

  // Add new lead from Property Detail form
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'New',
      created_at: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast('VIP Tour / Investment Request logged. Our partner desk has received your file.');
  };

  // Toggle wishlist
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved estates.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Added to saved estates.');
        return [...prev, id];
      }
    });
  };

  const pendingCount = properties.filter((p) => p.status === 'Pending').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
      {/* Massive Ambient Background Typography Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] z-0">
        <h1 className="font-headline text-[220px] sm:text-[330px] lg:text-[470px] font-black italic leading-none tracking-[-0.08em] text-white/80">
          FLX
        </h1>
      </div>

      {/* Brand Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        savedCount={savedIds.length}
        onToggleSavedModal={() => setSavedModalOpen(true)}
        pendingCount={pendingCount}
        newLeadsCount={newLeadsCount}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-black border border-red-600 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-red-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {activeView === 'discovery' && (
          <DiscoveryEngine
            properties={properties.filter((p) => p.status === 'Approved')}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onOpenDetails={handleOpenPropertyModal}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            onAddLead={handleAddLead}
          />
        )}

        {activeView === 'agent_intake' && (
          <AgentIntakePortal
            onPropertySubmit={handlePropertySubmit}
            onNavigateToDiscovery={(propId) => {
              setActiveView('discovery');
              if (propId) {
                const target = properties.find((p) => p.id === propId);
                if (target) handleOpenPropertyModal(target);
              }
            }}
          />
        )}

        {activeView === 'admin_crm' && (
          <AdminCrm
            properties={properties}
            leads={leads}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onViewProperty={handleOpenPropertyModal}
          />
        )}
      </main>

      {/* Detail Inspection Modal */}
      {activePropertyModal && (
        <PropertyDetailModal
          property={activePropertyModal}
          onClose={handleClosePropertyModal}
          onAddLead={handleAddLead}
          isSaved={savedIds.includes(activePropertyModal.id)}
          onToggleSave={handleToggleSave}
        />
      )}

      {/* Saved Estates Wishlist Modal */}
      <SavedEstatesModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedProperties={savedProperties}
        onRemoveSaved={handleToggleSave}
        onOpenDetails={handleOpenPropertyModal}
      />

      {/* Google Authentication SSO Modal */}
      <GoogleAuthModal />

      {/* Google Workspace Suite Modal (Calendar, Gmail, Contacts, Chat) */}
      <GoogleWorkspaceModal
        properties={properties}
        onOpenPropertyDetails={handleOpenPropertyModal}
      />

      {/* Bold Typography Technical Brand Footer */}
      <footer className="border-t border-white/10 bg-black mt-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black italic tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                FLX
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white">
                GLOBAL ASSETS
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md text-center md:text-left leading-relaxed">
              High-fidelity cinematic real estate discovery platform. Synchronizing 4K 60FPS video pipelines, spatial PostGIS mapping, and pro-forma investor yields.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-xs">
            <div className="flex items-center gap-6 uppercase text-[10px] tracking-[0.3em] font-semibold text-zinc-400">
              <button onClick={() => setActiveView('discovery')} className="hover:text-white transition-colors">
                Discovery
              </button>
              <button onClick={() => setActiveView('agent_intake')} className="hover:text-white transition-colors">
                Agent Portal
              </button>
              <button onClick={() => setActiveView('admin_crm')} className="hover:text-white transition-colors">
                Admin CRM
              </button>
            </div>
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-600">
              <span>LATENCY: 14MS</span>
              <span>•</span>
              <span>BUILD: 2026.4K</span>
              <span>•</span>
              <span>STATUS: ALL NODES OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Technical Sub-bar */}
        <div className="border-t border-white/5 py-3 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-600">
          <span>Copyright © 2026 FLX Global Real Estate. All Rights Reserved.</span>
          <span className="text-red-500/80">EQUAL HOUSING OPPORTUNITY // VERIFIED ASSETS</span>
        </div>
      </footer>
    </div>
  );
}
