import React, { useState, useEffect } from 'react';
import { X, History, Download, RefreshCw, Eye, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { fetchGenerationsFromSupabase } from '../services/supabase';
import { GenerationRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImageForRegenerate?: (record: GenerationRecord) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectImageForRegenerate,
}) => {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInspectRecord, setSelectedInspectRecord] = useState<GenerationRecord | null>(null);
  const [filterStyle, setFilterStyle] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      async function loadHistory() {
        setLoading(true);
        const data = await fetchGenerationsFromSupabase(user?.id);
        setGenerations(data);
        setLoading(false);
      }
      loadHistory();
    }
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const filteredList = generations.filter((g) => {
    if (filterStyle === 'all') return true;
    return g.selected_style === filterStyle;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ground/80 backdrop-blur-md animate-fadeIn flex justify-end">
      {/* Slide-over Container */}
      <div className="relative w-full max-w-2xl bg-ground-secondary border-l border-hairline h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-hairline flex items-center justify-between bg-ground">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-ink">
                Generated Studio History
              </h2>
              <p className="font-mono-label text-[10px] text-ink-muted">
                SAVED IN SUPABASE BACKEND • {generations.length} RECORDS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-ground-tertiary border border-hairline text-ink-muted hover:text-ink hover:border-ink/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-hairline bg-ground-tertiary/40 flex items-center space-x-2 overflow-x-auto text-[10px] font-mono-label">
          <span className="text-ink-muted flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>PRESET:</span>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3 font-mono-label text-xs text-accent-cyan animate-pulse">
              <History className="w-8 h-8 mx-auto text-accent-cyan animate-spin" />
              <p>LOADING GENERATED HISTORY FROM SUPABASE...</p>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="space-y-4">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-scientific-lg bg-ground-card border border-hairline p-4 space-y-3 hover:border-accent-cyan/40 transition-all group"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between font-mono-label text-[10px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-accent-cyan font-bold uppercase">{item.selected_style}</span>
                      <span className="text-ink-muted">• {item.aspect_ratio}</span>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Side-by-side Before/After Image Previews */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Old/Original Image */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono-label text-[8.5px] text-ink-muted">
                        <span>ORIGINAL INPUT</span>
                        <span>BEFORE</span>
                      </div>
                      <div className="relative aspect-square rounded overflow-hidden bg-ground border border-hairline">
                        <img
                          src={item.original_image_url}
                          alt="Original Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* AI Generated Image */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono-label text-[8.5px] text-accent-cyan">
                        <span>AI STUDIO RENDER</span>
                        <span>AFTER</span>
                      </div>
                      <div className="relative aspect-square rounded overflow-hidden bg-ground border border-accent-cyan/30 group-hover:border-accent-cyan">
                        <img
                          src={item.generated_image_url || item.original_image_url}
                          alt="Generated Studio Result"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Item Footer & Actions */}
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
                        onClick={() => setSelectedInspectRecord(item)}
                        className="px-2.5 py-1 rounded bg-ground-tertiary border border-hairline hover:border-accent-cyan text-ink-secondary hover:text-accent-cyan flex items-center space-x-1"
                        title="Interactive Slider Preview"
                      >
                        <Eye className="w-3 h-3" />
                        <span>COMPARE</span>
                      </button>

                      <a
                        href={item.generated_image_url || item.original_image_url}
                        download
                        className="px-2.5 py-1 rounded bg-accent-cyan text-ground font-bold hover:bg-accent-cyan/90 transition-colors flex items-center space-x-1"
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
            <div className="py-20 text-center space-y-3 font-mono-label text-xs text-ink-muted">
              <p>NO GENERATIONS FOUND.</p>
            </div>
          )}
        </div>

        {/* Modal Lightbox for Before/After Slider Inspection */}
        {selectedInspectRecord && (
          <div className="fixed inset-0 z-50 bg-ground/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-ground-secondary border border-hairline rounded-scientific-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div className="font-mono-label text-xs text-accent-cyan">
                  INTERACTIVE COMPARISON INSPECTOR // {selectedInspectRecord.selected_style.toUpperCase()}
                </div>
                <button
                  onClick={() => setSelectedInspectRecord(null)}
                  className="p-1 rounded text-ink-muted hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <BeforeAfterSlider
                originalUrl={selectedInspectRecord.original_image_url}
                generatedUrl={selectedInspectRecord.generated_image_url || selectedInspectRecord.original_image_url}
                aspectRatio={selectedInspectRecord.aspect_ratio}
                onDownload={() => {
                  const a = document.createElement('a');
                  a.href = selectedInspectRecord.generated_image_url || selectedInspectRecord.original_image_url;
                  a.download = `snapstudio_${selectedInspectRecord.selected_style}_${Date.now()}.jpg`;
                  a.click();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
