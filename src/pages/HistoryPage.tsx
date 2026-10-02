import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Download, RefreshCw, Filter, Search, Image as ImageIcon } from 'lucide-react';
import { getInitialMockGenerations } from '../services/supabase';
import { StatusBadge } from '../components/StatusBadge';

export const HistoryPage: React.FC = () => {
  const generations = getInitialMockGenerations();
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const filteredGenerations = generations.filter((g) => {
    const matchesStyle = filterStyle === 'all' || g.selected_style === filterStyle;
    const matchesSearch =
      !searchQuery ||
      g.selected_style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-7xl mx-auto space-y-8">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="font-mono-label text-[10px] text-accent-cyan mb-1 flex items-center space-x-1.5">
            <History className="w-3 h-3" />
            <span>ACCOUNT VAULT // GENERATION HISTORY</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tightest">
            Generated Studio Archive
          </h1>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search style or ID..."
              className="pl-8 pr-3 py-1.5 rounded-scientific bg-ground-secondary border border-hairline text-ink font-mono text-xs focus:outline-none focus:border-accent-cyan w-44"
            />
          </div>

          <div className="flex items-center space-x-2 font-mono-label text-[10px] overflow-x-auto pb-1 max-w-full">
            <span className="text-ink-muted flex items-center space-x-1 shrink-0">
              <Filter className="w-3 h-3" />
              <span>FILTER:</span>
            </span>
            {['all', 'clean-white', 'light-neutral', 'soft-studio', 'minimal-premium'].map((style) => (
              <button
                key={style}
                onClick={() => setFilterStyle(style)}
                className={`px-2.5 py-1 rounded transition-colors uppercase shrink-0 ${
                  filterStyle === style
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 font-bold'
                    : 'bg-ground-secondary border border-hairline text-ink-muted hover:text-ink'
                }`}
              >
                {style.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredGenerations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenerations.map((item) => (
            <div
              key={item.id}
              className="rounded-scientific-lg bg-ground-card border border-hairline overflow-hidden space-y-3 p-4 hover:border-accent-cyan/40 transition-all group"
            >
              {/* Header Details */}
              <div className="flex items-center justify-between font-mono-label text-[9.5px]">
                <span className="text-accent-cyan uppercase">{item.selected_style}</span>
                <StatusBadge status={item.status} />
              </div>

              {/* Side by side comparison previews */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="font-mono-label text-[8.5px] text-ink-muted">ORIGINAL</span>
                  <div className="aspect-square bg-ground-tertiary rounded overflow-hidden border border-hairline">
                    <img
                      src={item.original_image_url}
                      alt="Original Input"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-mono-label text-[8.5px] text-accent-cyan">AI STUDIO</span>
                  <div className="aspect-square bg-ground-tertiary rounded overflow-hidden border border-accent-cyan/30">
                    <img
                      src={item.generated_image_url || item.original_image_url}
                      alt="AI Result"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="pt-2 border-t border-hairline flex items-center justify-between font-mono-label text-[10px]">
                <span className="text-ink-muted">
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/generate')}
                    className="p-1.5 rounded bg-ground-tertiary border border-hairline hover:border-accent-cyan text-ink-secondary hover:text-accent-cyan"
                    title="Generate Again"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={item.generated_image_url || item.original_image_url}
                    download
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-accent-cyan text-ground font-bold hover:bg-accent-cyan/90 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>DOWNLOAD</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-scientific-lg bg-ground-secondary border border-hairline space-y-4">
          <ImageIcon className="w-8 h-8 text-ink-muted mx-auto" />
          <p className="font-heading text-ink text-sm">No generations found for this filter.</p>
          <button
            onClick={() => setFilterStyle('all')}
            className="font-mono-label text-xs text-accent-cyan underline"
          >
            RESET FILTER
          </button>
        </div>
      )}
    </div>
  );
};
