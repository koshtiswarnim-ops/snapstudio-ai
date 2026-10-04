import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CreditCard, Image as ImageIcon, Download, ArrowUpRight, History, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import { fetchGenerationsFromSupabase } from '../services/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { GenerationRecord } from '../types';
import { downloadImageFile } from '../utils/download';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { availableCredits, totalUsed } = useCredits();
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchGenerationsFromSupabase(user?.id);
      setGenerations(data);
    }
    loadData();
  }, [user?.id]);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="font-mono-label text-[10px] text-accent-cyan mb-1">
            ACCOUNT OVERVIEW // {user?.email}
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tightest">
            Welcome Back, {user?.name || 'Seller'}
          </h1>
        </div>

        <Link
          to="/generate"
          className="px-5 py-2.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all flex items-center justify-center space-x-2 shadow-[0_0_16px_rgba(79,216,232,0.25)]"
        >
          <Sparkles className="w-4 h-4" />
          <span>NEW GENERATION</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Credits Remaining */}
        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>CREDITS REMAINING</span>
            <CreditCard className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-accent-cyan">
            {availableCredits}
          </div>
          <div className="flex items-center justify-between text-xs text-ink-secondary pt-2 border-t border-hairline">
            <span>Plan: <strong className="text-ink uppercase">{user?.plan || 'PRO'}</strong></span>
            <Link to="/pricing" className="text-accent-cyan hover:underline font-mono-label text-[10px]">
              BUY MORE CREDITS →
            </Link>
          </div>
        </div>

        {/* Total Generations */}
        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>TOTAL GENERATIONS</span>
            <ImageIcon className="w-4 h-4 text-accent-violet" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-ink">
            {totalUsed}
          </div>
          <div className="text-xs text-ink-secondary pt-2 border-t border-hairline font-mono-label text-[10px]">
            100% E-COMMERCE PRESERVED
          </div>
        </div>

        {/* Account Status */}
        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>SYSTEM STATUS</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">
            OPERATIONAL
          </div>
          <div className="text-xs text-ink-secondary pt-2 border-t border-hairline font-mono-label text-[10px]">
            LATENCY: 4.2s (N8N CLOUD)
          </div>
        </div>
      </div>

      {/* Recent Generations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-2">
          <div className="flex items-center space-x-2 font-mono-label text-[10.5px] text-ink">
            <History className="w-4 h-4 text-accent-cyan" />
            <span>RECENT GENERATED IMAGES</span>
          </div>
          <Link to="/history" className="font-mono-label text-[10px] text-accent-cyan hover:underline">
            VIEW ALL HISTORY →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className="group rounded-scientific-lg bg-ground-card border border-hairline overflow-hidden hover:border-accent-cyan/40 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square bg-ground-tertiary overflow-hidden">
                <img
                  src={gen.generated_image_url || gen.original_image_url}
                  alt="Product Generation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={gen.status} />
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-ground/80 backdrop-blur font-mono-label text-[9px] text-ink-secondary">
                  {gen.selected_style.toUpperCase()} • {gen.aspect_ratio}
                </div>
              </div>

              {/* Info & Download Footer */}
              <div className="p-4 flex items-center justify-between border-t border-hairline">
                <div className="font-mono-label text-[10px] text-ink-muted">
                  {new Date(gen.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <button
                  onClick={() => downloadImageFile(gen.generated_image_url || gen.original_image_url, `snapstudio_${gen.selected_style}_${gen.id}.jpg`)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded bg-ground-tertiary border border-hairline hover:border-accent-cyan text-ink-secondary hover:text-accent-cyan font-mono-label text-[10px] transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>DOWNLOAD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
