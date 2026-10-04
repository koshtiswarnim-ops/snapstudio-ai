import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(email);
      setSuccessMsg('Authenticated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/generate');
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Sign in encountered an issue.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-ground text-ink">
      <div className="w-full max-w-md p-8 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 font-mono-label text-[10px] text-accent-cyan">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            <span>SNAPSTUDIO AUTHENTICATION</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink tracking-tightest">
            Sign In To Your Account
          </h1>
          <p className="text-xs text-ink-secondary">
            Access your e-commerce AI workspace & generation history.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-scientific bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 font-mono-label text-xs flex items-center space-x-2 text-center justify-center animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded bg-red-950/40 border border-red-500/40 text-red-300 font-mono-label text-xs">
            {error}
          </div>
        )}

        {/* 1-Click Google Sign In Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full py-3 rounded-scientific bg-ground-tertiary border border-hairline text-ink font-mono-label font-bold text-xs hover:border-accent-cyan/50 hover:bg-ground-tertiary/80 transition-all flex items-center justify-center space-x-2"
        >
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
          <span>CONTINUE WITH GOOGLE</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-hairline"></div>
          <span className="flex-shrink mx-3 font-mono-label text-[9.5px] text-ink-muted">OR WITH EMAIL</span>
          <div className="flex-grow border-t border-hairline"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono-label text-[10px] text-ink-secondary">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@store.com"
                className="w-full pl-10 pr-4 py-2.5 rounded bg-ground-tertiary border border-hairline text-ink font-sans text-sm focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-mono-label text-[10px] text-ink-secondary">PASSWORD</label>
              <Link to="/forgot-password" className="font-mono-label text-[9.5px] text-accent-cyan hover:underline">
                FORGOT?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded bg-ground-tertiary border border-hairline text-ink font-sans text-sm focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all shadow-[0_0_16px_rgba(79,216,232,0.25)] flex items-center justify-center space-x-2"
          >
            {loading ? <span>AUTHENTICATING...</span> : <span>SIGN IN</span>}
          </button>
        </form>

        <div className="text-center font-mono-label text-[10px] text-ink-muted pt-2 border-t border-hairline">
          DON'T HAVE AN ACCOUNT?{' '}
          <Link to="/signup" className="text-accent-cyan hover:underline font-bold">
            CREATE ACCOUNT FOR FREE →
          </Link>
        </div>
      </div>
    </div>
  );
};
