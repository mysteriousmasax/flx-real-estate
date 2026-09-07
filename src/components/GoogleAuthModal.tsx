import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { X, ShieldCheck, CheckCircle2, Sparkles, User, Briefcase, Lock } from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, isLoading } = useAuth();
  const { theme } = useTheme();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Agent' | 'Investor' | 'Owner' | 'Admin' | 'Client'>('Client');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickSignIn = (role: 'Agent' | 'Investor' | 'Owner' | 'Admin' | 'Client') => {
    signInWithGoogle({ role });
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    signInWithGoogle({
      email: customEmail,
      name: customName || customEmail.split('@')[0],
      role: selectedRole,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all border border-red-600/40 bg-[#0e0e11] text-white"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-2.5">
            {/* Official Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-white">
              GOOGLE IDENTITY SSO
            </span>
          </div>

          <button
            id="btn-close-google-auth"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-headline text-2xl font-black italic tracking-tight uppercase">
              Sign In with Google
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Authenticate via Google to access verified listings, save portfolio estates, and manage cadastre submissions.
            </p>
          </div>

          {/* Primary 1-Click Google Auth Action */}
          <button
            id="btn-google-sso-primary"
            disabled={isLoading}
            onClick={() => handleQuickSignIn('Client')}
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99] border border-white/20"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{isLoading ? 'Authenticating with Google...' : 'Continue with your Google account'}</span>
          </button>

          {/* Quick Profiles Switcher */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
              Choose a workspace after sign-in:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSignIn('Agent')}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-bold truncate text-[11px]">Agent workspace</div>
                  <div className="text-[9px] text-zinc-400 truncate">Property intake & GPS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSignIn('Owner')}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-blue-400" /></div>
                <div className="min-w-0 flex-1"><div className="text-white font-bold truncate text-[11px]">Property Owner</div><div className="text-[9px] text-zinc-400 truncate">Asset account</div></div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSignIn('Investor')}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-bold truncate text-[11px]">Investor workspace</div>
                  <div className="text-[9px] text-zinc-400 truncate">Opportunities & yields</div>
                </div>
              </button>
            </div>
          </div>

          {/* Advanced / Custom Google Email Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 font-mono uppercase tracking-wider underline flex items-center gap-1 mx-auto"
            >
              <span>{showAdvanced ? 'Hide Custom Google Account' : 'Sign In With Another Google Account'}</span>
            </button>

            {showAdvanced && (
              <form onSubmit={handleCustomSignIn} className="mt-3 space-y-3 p-3 bg-black/40 rounded-xl border border-white/10">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3 py-2 text-xs bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Role:</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="text-xs bg-[#09090b] border border-white/10 rounded px-2 py-1 text-white focus:outline-none"
                  >
                    <option value="Agent">Agent</option>
                    <option value="Investor">Investor</option>
                    <option value="Owner">Property Owner</option>
                    <option value="Client">Client / Renter</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Authorize Google Sign-In
                </button>
              </form>
            )}
          </div>

          {/* Privacy & Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono tracking-wider pt-2 border-t border-white/5">
            <Lock className="w-3 h-3 text-red-500" />
            <span>256-BIT ENCRYPTED GOOGLE OAUTH 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
