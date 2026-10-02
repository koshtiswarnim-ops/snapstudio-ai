import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import { User, Mail, Shield, Save, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { availableCredits, totalUsed } = useCredits();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-4xl mx-auto space-y-8">
      <div className="border-b border-hairline pb-4">
        <div className="font-mono-label text-[10px] text-accent-cyan mb-1">
          USER PROFILE & PREFERENCES
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tightest">
          Account Settings
        </h1>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-scientific bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono-label text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mx-auto overflow-hidden flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-accent-cyan" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-ink">{user?.name}</h3>
            <p className="font-mono-label text-[10px] text-ink-muted">{user?.email}</p>
          </div>
          <div className="pt-3 border-t border-hairline font-mono-label text-[10px] text-accent-cyan font-bold">
            PLAN: {user?.plan?.toUpperCase()} • {availableCredits} CREDITS
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSave} className="md:col-span-2 p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono-label text-[10px] text-ink-secondary">FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-ground-tertiary border border-hairline text-ink font-sans text-sm focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono-label text-[10px] text-ink-secondary">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-ground-tertiary border border-hairline text-ink font-sans text-sm focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CHANGES</span>
          </button>
        </form>
      </div>
    </div>
  );
};
