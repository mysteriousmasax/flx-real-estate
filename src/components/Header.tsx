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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090b0e]/80 backdrop-blur-xl">
      <div className="hidden xl:flex items-center justify-between px-6 md:px-10 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-400 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-red-400 font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            FLX Market Intelligence
          </span>
          <span className="text-white/10">•</span>
          <span>Tanzania Investment View</span>
        </div>
        <div className="flex items-center gap-5">
          <span>
            Intake Queue: <strong className="text-white">{pendingCount} pending</strong>
          </span>
          <span>
            Leads: <strong className="text-red-400">+{newLeadsCount} new</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-h-20 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-6">
          <FlxLogo
            size="sm"
            showTagline={false}
            className="shrink-0"
            onClick={() => onSelectView('discovery')}
          />
        </div>

        <div className="hidden xl:flex items-center gap-2.5">
          <button
            onClick={() => onSelectView('discovery')}
            className={`flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] font-black uppercase rounded-xl transition-all duration-200 border ${
              activeView === 'discovery'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_10px_24px_rgba(220,38,38,0.38)]'
                : 'text-zinc-300 hover:text-white border-transparent bg-white/0 hover:bg-white/[0.03]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discovery</span>
          </button>

          <button
            onClick={() => onSelectView('agent_intake')}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] font-black uppercase rounded-xl transition-all duration-200 border ${
              activeView === 'agent_intake'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_10px_24px_rgba(220,38,38,0.38)]'
                : 'border-red-500/40 text-red-300 bg-red-500/5 hover:bg-red-500/10 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Agent Portal</span>
            <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-red-950/70 border border-red-500/40 text-red-200 font-mono">
              GPS
            </span>
          </button>

          <button
            onClick={() => onSelectView('admin_crm')}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.22em] font-black uppercase rounded-xl transition-all duration-200 border ${
              activeView === 'admin_crm'
                ? 'bg-red-600 text-white border-red-600 shadow-[0_10px_24px_rgba(220,38,38,0.38)]'
                : 'text-zinc-300 hover:text-white border-transparent bg-white/0 hover:bg-white/[0.03]'
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
            className="flex items-center gap-2 px-3.5 py-2.5 text-[10px] tracking-[0.2em] font-black uppercase rounded-xl border border-blue-500/35 bg-blue-500/5 text-blue-300 hover:bg-blue-500/10 hover:text-white transition-all"
            title="Google Calendar, Gmail, Contacts & Chat"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace</span>
            <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-blue-500/10 border border-blue-400/30 text-blue-200 font-mono">
              SUITE
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeView === 'discovery' && (
            <div className="hidden sm:flex items-center bg-white/[0.02] border border-white/10 rounded-xl p-1">
              <button
                onClick={() => onSelectType('All')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all rounded-lg ${
                  selectedType === 'All'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectType('Invest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all rounded-lg ${
                  selectedType === 'Invest'
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                    : 'text-zinc-400 hover:text-emerald-300'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Invest</span>
              </button>
              <button
                onClick={() => onSelectType('Live')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all rounded-lg ${
                  selectedType === 'Live'
                    ? 'bg-red-500/10 border border-red-500/40 text-red-300'
                    : 'text-zinc-400 hover:text-red-300'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Live</span>
              </button>
            </div>
          )}

          <button
            onClick={onToggleSavedModal}
            className="relative p-2.5 bg-white/[0.02] border border-white/10 hover:border-red-500/50 text-zinc-300 hover:text-red-400 transition-colors rounded-xl"
            title="Saved Estates"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <UserProfileMenu />
        </div>
      </div>

      <div className="flex xl:hidden border-t border-white/5 bg-[#0A0A0A] px-4 py-2.5 justify-around">
        <button
          onClick={() => onSelectView('discovery')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'discovery' ? 'text-red-500' : 'text-zinc-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discovery</span>
        </button>
        <button
          onClick={() => onSelectView('agent_intake')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'agent_intake' ? 'text-red-500' : 'text-zinc-400'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Agent</span>
        </button>
        <button
          onClick={() => onSelectView('admin_crm')}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] ${
            activeView === 'admin_crm' ? 'text-red-500' : 'text-zinc-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
