import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-ground text-ink">
      <div className="w-full max-w-md p-8 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 font-mono-label text-[10px] text-accent-cyan">
            <span>ACCOUNT SECURITY RECOVERY</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink tracking-tightest">
            Reset Password
          </h1>
          <p className="text-xs text-ink-secondary">
            Enter your registered email address to receive a secure recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-scientific bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono-label text-xs space-y-2 text-center">
            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
            <p>Password reset link dispatched to <strong>{email}</strong>.</p>
            <Link to="/login" className="inline-block pt-2 text-accent-cyan underline">
              RETURN TO LOGIN
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all shadow-[0_0_16px_rgba(79,216,232,0.25)]"
            >
              SEND RECOVERY LINK
            </button>
          </form>
        )}

        <div className="text-center font-mono-label text-[10px] text-ink-muted pt-2 border-t border-hairline">
          <Link to="/login" className="text-ink-secondary hover:text-ink flex items-center justify-center space-x-1">
            <ArrowLeft className="w-3 h-3" />
            <span>BACK TO LOGIN</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
