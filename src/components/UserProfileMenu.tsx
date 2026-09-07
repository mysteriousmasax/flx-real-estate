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
  const { user, isAuthenticated, openAuthModal, signOut } = useAuth();
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
          id="btn-header-google-signin"
          onClick={openAuthModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-white hover:bg-zinc-100 text-zinc-900 border-white/20 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
          <span className="hidden sm:inline">Google Sign In</span>
          <span className="sm:hidden">Sign In</span>
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
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
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
                    Google SSO
                  </span>
                </div>
              </div>
            </div>

            {/* Google Workspace Suite Shortcuts */}
            <div className="py-1 border-t border-white/10">
              <div className="px-4 py-1 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                Google Workspace
              </div>
              <button
                onClick={() => {
                  openWorkspaceModal('calendar');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-1.5 text-left text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Calendar</span>
              </button>
              <button
                onClick={() => {
                  openWorkspaceModal('gmail');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-1.5 text-left text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>Gmail Dispatch</span>
              </button>
              <button
                onClick={() => {
                  openWorkspaceModal('contacts');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-1.5 text-left text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Contacts</span>
              </button>
              <button
                onClick={() => {
                  openWorkspaceModal('chat');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-1.5 text-left text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Chat Space</span>
              </button>
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

              <button
                onClick={() => {
                  openAuthModal();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Switch Google Profile</span>
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-1 border-t border-white/10">
              <button
                id="btn-google-signout"
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Google</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
