import React from 'react';
import { FlxLogo } from './FlxLogo';
import { UserProfileMenu } from './UserProfileMenu';
import { ActiveAppView, PropertyType } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  Compass, 
  Camera, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Home, 
  SlidersHorizontal,
  Bell,
  Sparkles,
  Calendar
} from 'lucide-react';

interface HeaderProps {
  activeView: ActiveAppView;
  onSelectView: (view: ActiveAppView) => void;
  selectedType: 'All' | PropertyType;
  onSelectType: (type: 'All' | PropertyType) => void;
  savedCount: number;
  onToggleSavedModal: () => void;
  pendingCount: number;
  newLeadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  selectedType,
  onSelectType,
  savedCount,
  onToggleSavedModal,
  pendingCount,
  newLeadsCount,
}) => {
  const { openWorkspaceModal } = useWorkspace();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md">
      {/* Top Brushed Chrome / System Status Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 md:px-10 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] bg-black border-b border-white/5 text-zinc-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-red-500 font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            FLX STREAM ENGINE // 4K 60FPS
          </span>
          <span className="text-white/10">/</span>
          <span className="text-zinc-400">TANZANIA ORBITAL SATELLITE RADAR</span>
          <span className="text-white/10">/</span>
          <span className="text-zinc-500">ENCRYPTED TELEMETRY STREAM</span>
        </div>
        <div className="flex items-center gap-5 font-mono text-[10px]">
          <span className="text-zinc-400">
            INTAKE QUEUE: <strong className="text-white font-mono">{pendingCount} PENDING</strong>
          </span>
          <span className="text-white/10">/</span>
          <span className="text-zinc-400">
            LEADS PIPELINE: <strong className="text-red-500 font-mono">+{newLeadsCount} NEW</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <FlxLogo
            size="md"
            showTagline={true}
            onClick={() => onSelectView('discovery')}
          />
        </div>

        {/* Primary View Switcher: Discovery | Field Intake | Admin CRM */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onSelectView('discovery')}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.3em] font-black uppercase transition-all duration-200 border ${
              activeView === 'discovery'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-white border-transparent hover:border-white/10 bg-black/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discovery</span>
          </button>

          <button
            onClick={() => onSelectView('agent_intake')}
            className={`relative flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.3em] font-black uppercase transition-all duration-200 border ${
              activeView === 'agent_intake'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'border-red-600 text-red-500 bg-red-600/10 hover:bg-red-600 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Agent Portal</span>
            <span className="px-1 py-0.2 rounded text-[8px] bg-red-950 border border-red-500/40 text-red-300 font-mono">
              GPS
            </span>
          </button>

          <button
            onClick={() => onSelectView('admin_crm')}
            className={`relative flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.3em] font-black uppercase transition-all duration-200 border ${
              activeView === 'admin_crm'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-white border-transparent hover:border-white/10 bg-black/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin CRM</span>
            {(pendingCount > 0 || newLeadsCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => openWorkspaceModal('calendar')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[10px] tracking-[0.25em] font-black uppercase transition-all duration-200 border border-blue-500/40 text-blue-400 bg-blue-950/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm"
            title="Google Calendar, Gmail, Contacts & Chat"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Workspace</span>
            <span className="px-1 py-0.2 rounded text-[8px] bg-blue-900 border border-blue-400/40 text-blue-200 font-mono">
              SUITE
            </span>
          </button>
        </div>

        {/* Right Section: Invest / Live Pill Toggle & Actions */}
        <div className="flex items-center gap-3">
          {activeView === 'discovery' && (
            <div className="flex items-center bg-black/60 p-1 border border-white/10">
              <button
                onClick={() => onSelectType('All')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  selectedType === 'All'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectType('Invest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  selectedType === 'Invest'
                    ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Invest</span>
              </button>
              <button
                onClick={() => onSelectType('Live')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  selectedType === 'Live'
                    ? 'bg-red-950 border border-red-600/60 text-red-300'
                    : 'text-zinc-400 hover:text-red-400'
                }`}
              >
                <Home className="w-3 h-3 text-red-500" />
                <span>Live</span>
              </button>
            </div>
          )}

          {/* Saved wishlist button */}
          <button
            onClick={onToggleSavedModal}
            className="relative p-2.5 bg-black border border-white/10 hover:border-red-600 text-zinc-300 hover:text-red-500 transition-colors"
            title="Saved Estates"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-red-600 text-red-600' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* User / Agent Google Auth & Theme Controls */}
          <UserProfileMenu />
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-white/5 bg-[#0A0A0A] px-4 py-2.5 justify-around">
        <button
          onClick={() => onSelectView('discovery')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'discovery' ? 'text-red-600' : 'text-zinc-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discovery</span>
        </button>
        <button
          onClick={() => onSelectView('agent_intake')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'agent_intake' ? 'text-red-600' : 'text-zinc-400'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Agent</span>
        </button>
        <button
          onClick={() => onSelectView('admin_crm')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'admin_crm' ? 'text-red-600' : 'text-zinc-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
