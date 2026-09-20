import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, UserRound, BriefcaseBusiness, Building2, Crown, LogIn } from 'lucide-react';

export const LocalAuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, signInWithEmail, registerAccount } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Agent' | 'Investor' | 'Owner' | 'Admin' | 'Client'>('Client');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthModalOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      setMode('login');
      setRole('Client');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in your email and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter a display name for your account.');
        return;
      }

      const result = await registerAccount({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      const homePath = {
        Agent: '/agent/intake',
        Owner: '/owner/portfolio',
        Admin: '/admin/dashboard',
        Investor: '/investor/opportunities',
        Client: '/marketplace',
      }[result.role || role] || '/marketplace';

      closeAuthModal();
      navigate(homePath, { replace: true });
      return;
    }

    const result = await signInWithEmail({
      email: email.trim(),
      password,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    const homePath = {
      Agent: '/agent/intake',
      Owner: '/owner/portfolio',
      Admin: '/admin/dashboard',
      Investor: '/investor/opportunities',
      Client: '/marketplace',
    }[result.role || 'Client'] || '/marketplace';

    closeAuthModal();
    navigate(homePath, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-[#0d0f12] shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/20 border border-red-500/40">
              <ShieldCheck className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">FLX access</div>
              <h3 className="text-lg font-black uppercase text-white">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
            </div>
          </div>
          <button onClick={closeAuthModal} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                mode === 'login' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                mode === 'register' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-[#101114] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#101114] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#101114] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Select role</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Client', value: 'Client', icon: <UserRound className="h-3.5 w-3.5" /> },
                  { label: 'Investor', value: 'Investor', icon: <BriefcaseBusiness className="h-3.5 w-3.5" /> },
                  { label: 'Owner', value: 'Owner', icon: <Building2 className="h-3.5 w-3.5" /> },
                  { label: 'Agent', value: 'Agent', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  { label: 'Admin', value: 'Admin', icon: <Crown className="h-3.5 w-3.5" /> },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value as typeof role)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                      role === option.value
                        ? 'border-red-500 bg-red-600/10 text-red-300'
                        : 'border-white/10 bg-black/30 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</div>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-red-500"
            >
              <LogIn className="h-4 w-4" />
              {mode === 'login' ? 'Continue' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
