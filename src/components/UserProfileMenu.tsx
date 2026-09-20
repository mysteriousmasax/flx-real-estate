import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  Sun, 
  Moon, 
  ChevronDown, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Sparkles,
  Calendar,
  Mail,
  Users,
  MessageSquare
} from 'lucide-react';

export const UserProfileMenu: React.FC = () => {
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openWorkspaceModal } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={openAuthModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-white hover:bg-zinc-100 text-zinc-900 border-white/20 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Member Login</span>
          <span className="sm:hidden">Login</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" ref={menuRef}>
      <ThemeToggle />

      <div className="relative">
        <button
          id="btn-user-avatar-menu"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-white/20 bg-black/60 hover:bg-black/90 transition-all text-left"
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-red-500"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-[11px] font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden sm:block text-left">
            <span className="block text-[11px] font-bold text-white truncate max-w-[100px] leading-tight">
              {user.name.split(' ')[0]}
            </span>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-emerald-400">
              Verified
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border border-white/10 bg-[#0e0e11] text-white py-2 z-50 animate-in fade-in-50 zoom-in-95">
            {/* Header info */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white truncate">{user.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] text-zinc-400 truncate font-mono">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-red-950/80 border border-red-500/40 text-red-300">
                    {user.role || 'Member'}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    FLX Member
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-1 border-t border-white/10">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs hover:bg-white/5 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>Theme: <strong className="uppercase">{theme}</strong></span>
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Toggle</span>
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-1 border-t border-white/10">
              <button
                id="btn-signout"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
