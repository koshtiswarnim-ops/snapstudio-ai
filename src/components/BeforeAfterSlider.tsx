import React, { useState, useRef, useCallback } from 'react';
import { Download, Sliders, Eye, RefreshCw } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  generatedUrl: string;
  onDownload?: () => void;
  onRegenerate?: () => void;
  className?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  generatedUrl,
  onDownload,
  onRegenerate,
  className = '',
  aspectRatio = '1:1',
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPos(percentage);
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '4:5':
        return 'aspect-[4/5]';
      case '16:9':
        return 'aspect-[16/9]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center space-x-2 font-mono-label text-ink-secondary">
          <Eye className="w-3.5 h-3.5 text-accent-cyan" />
          <span>COMPARE MODE:</span>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-2 py-1 rounded text-[10px] transition-colors ${
              viewMode === 'slider'
                ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            SLIDER
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2 py-1 rounded text-[10px] transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            SPLIT VIEW
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-scientific bg-ground-secondary border border-hairline text-ink-secondary hover:text-ink hover:border-ink/30 font-mono-label text-[10px] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>REGENERATE</span>
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-[10.5px] hover:bg-accent-cyan/90 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD E-COMMERCE IMAGE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full overflow-hidden rounded-scientific-lg border border-hairline bg-ground-secondary select-none cursor-ew-resize touch-none ${getAspectClass()}`}
        >
          {/* AI Generated Image (Right/Background) */}
          <img
            src={generatedUrl}
            alt="AI Studio Result"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Original Image (Left/Clipped Foreground) */}
          <img
            src={originalUrl}
            alt="Original Product Photo"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          />

          {/* Split Line handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-accent-cyan shadow-[0_0_12px_#4FD8E8] pointer-events-none z-10"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-ground border-2 border-accent-cyan flex items-center justify-center shadow-lg">
              <Sliders className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-ground/80 backdrop-blur border border-hairline font-mono-label text-ink-secondary text-[9px] pointer-events-none">
            ORIGINAL PHOTO
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-accent-cyan/15 backdrop-blur border border-accent-cyan/30 font-mono-label text-accent-cyan text-[9px] pointer-events-none">
            AI STUDIO RENDER
          </div>
        </div>
      ) : (
        /* Side by Side Split View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
              <span>INPUT PHOTO</span>
              <span>BEFORE</span>
            </div>
            <div className={`relative overflow-hidden rounded-scientific-lg border border-hairline bg-ground-secondary ${getAspectClass()}`}>
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono-label text-[10px] text-accent-cyan">
              <span>PROPOSED E-COMMERCE PHOTO</span>
              <span>AFTER (AI)</span>
            </div>
            <div className={`relative overflow-hidden rounded-scientific-lg border border-accent-cyan/30 bg-ground-secondary ${getAspectClass()}`}>
              <img
                src={generatedUrl}
                alt="Generated Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
