import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, CheckCircle2, Sparkles, User, Briefcase, Lock, KeyRound, UserPlus } from 'lucide-react';

type RoleOption = 'Agent' | 'Investor' | 'Owner' | 'Admin' | 'Client';

export const GoogleAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signUp, signIn, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleOption>('Client');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        await signUp({ name, email, password, role: selectedRole });
      } else {
        await signIn({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete authentication.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl transition-all border border-red-600/40 bg-[#0e0e11] text-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/60 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-white">
              FLX MEMBER ACCESS
            </span>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-headline text-2xl font-black italic tracking-tight uppercase">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Access the marketplace, your role dashboard, and investor or owner tools from a single local account.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${mode === 'signin' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${mode === 'signup' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Musa Hassan"
                  className="w-full px-3 py-2.5 text-sm bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@flx.local"
                className="w-full px-3 py-2.5 text-sm bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Choose role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as RoleOption)}
                  className="w-full px-3 py-2.5 text-sm bg-[#09090b] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Client">Client / Buyer</option>
                  <option value="Investor">Investor</option>
                  <option value="Agent">Agent</option>
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? <KeyRound className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Quick role access</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setMode('signup'); setSelectedRole('Agent'); }} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shrink-0"><Briefcase className="w-3.5 h-3.5 text-red-400" /></div>
                <div className="min-w-0 flex-1"><div className="text-white font-bold truncate text-[11px]">Agent</div><div className="text-[9px] text-zinc-400 truncate">Intake tools</div></div>
              </button>

              <button type="button" onClick={() => { setMode('signup'); setSelectedRole('Owner'); }} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-blue-400" /></div>
                <div className="min-w-0 flex-1"><div className="text-white font-bold truncate text-[11px]">Owner</div><div className="text-[9px] text-zinc-400 truncate">Portfolio</div></div>
              </button>

              <button type="button" onClick={() => { setMode('signup'); setSelectedRole('Investor'); }} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center shrink-0"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /></div>
                <div className="min-w-0 flex-1"><div className="text-white font-bold truncate text-[11px]">Investor</div><div className="text-[9px] text-zinc-400 truncate">Deals</div></div>
              </button>

              <button type="button" onClick={() => { setMode('signup'); setSelectedRole('Admin'); }} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-zinc-600/30 border border-zinc-500 flex items-center justify-center shrink-0"><ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /></div>
                <div className="min-w-0 flex-1"><div className="text-white font-bold truncate text-[11px]">Admin</div><div className="text-[9px] text-zinc-400 truncate">CRM</div></div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono tracking-wider pt-2 border-t border-white/5">
            <Lock className="w-3 h-3 text-red-500" />
            <span>LOCAL ENCRYPTED MEMBER SESSION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
