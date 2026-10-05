import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Sparkles, Image as ImageIcon, Check, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import { BackgroundStyle, AspectRatio, QualityMode, GenerationStatus, GenerationRecord } from '../types';
import { triggerFalAIGeneration } from '../services/fal';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { StatusBadge } from '../components/StatusBadge';
import { AuthRequiredModal } from '../components/AuthRequiredModal';
import { saveGenerationRecordToSupabase } from '../services/supabase';
import { downloadImageFile } from '../utils/download';

const BACKGROUND_STYLES: { id: BackgroundStyle; name: string; desc: string; tag: string }[] = [
  { id: 'clean-white', name: 'Clean White', desc: 'Compliant 100% pure white backdrop for Amazon & Flipkart', tag: 'AMAZON SPEC' },
  { id: 'light-neutral', name: 'Light Neutral', desc: 'Soft warm grey marble pedestal for luxury D2C websites', tag: 'PREMIUM' },
  { id: 'soft-studio', name: 'Soft Studio', desc: 'Subtle ambient studio shadows with soft diffuse lighting', tag: 'CATALOG' },
  { id: 'minimal-premium', name: 'Minimal Premium', desc: 'Sleek dark geometric podium for modern electronics & apparel', tag: 'INSTAGRAM' },
];

export const GeneratePage: React.FC = () => {
  const { user } = useAuth();
  const { availableCredits, deductCredit, addCredits, hasSufficientCredits } = useCredits();
  const navigate = useNavigate();

  // Workspace Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<BackgroundStyle>('clean-white');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<QualityMode>('high');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Generation Processing State
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [resultImage, setResultImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const triggerUploadClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (file: File) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Validate file type & size (10 MB max)
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds maximum size limit of 10 MB.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    try {
      const base64DataUrl = await fileToBase64(file);
      setOriginalPreviewUrl(base64DataUrl);
    } catch (e) {
      const objectUrl = URL.createObjectURL(file);
      setOriginalPreviewUrl(objectUrl);
    }
    setStatus('idle');
    setResultImage('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartGeneration = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!originalPreviewUrl) {
      setErrorMessage('Please upload a product photo first.');
      return;
    }

    if (!hasSufficientCredits()) {
      setErrorMessage('You do not have enough credits to complete this generation.');
      return;
    }

    setErrorMessage('');
    setStatus('uploading');
    setProgressPercent(10);
    setProgressMsg('Uploading product image to serverless pipeline...');

    // Safely deduct 1 credit
    const deducted = deductCredit();
    if (!deducted) {
      setErrorMessage('Failed to deduct credit. Please check your credit balance.');
      setStatus('idle');
      return;
    }

    setStatus('ai-generating');

    const result = await triggerFalAIGeneration(
      {
        userId: user?.id || 'usr_guest',
        originalImageUrl: originalPreviewUrl,
        selectedStyle,
        aspectRatio,
        quality,
      },
      (msg, pct) => {
        setProgressMsg(msg);
        setProgressPercent(pct);
      }
    );

    if (result.success && result.generatedImageUrl) {
      setResultImage(result.generatedImageUrl);
      setStatus('completed');

      // Save to history state & Supabase backend database
      const newRecord: GenerationRecord = {
        id: result.requestId || `gen_${Date.now()}`,
        user_id: user?.email || user?.id || 'usr_guest',
        original_image_url: originalPreviewUrl,
        generated_image_url: result.generatedImageUrl,
        selected_style: selectedStyle,
        aspect_ratio: aspectRatio,
        quality: quality,
        status: 'completed',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };
      await saveGenerationRecordToSupabase(newRecord, user?.email || user?.id);
    } else {
      // Auto-refund deducted credit upon generation failure
      addCredits(1);
      setStatus('failed');
      setErrorMessage(result.error || 'Generation failed. Your credit has been refunded.');
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    await downloadImageFile(resultImage, `snapstudio_${selectedStyle}_${Date.now()}.jpg`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-7xl mx-auto space-y-8">
      {/* Header breadcrumb & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center space-x-2 font-mono-label text-[10px] text-accent-cyan mb-1">
            <Link to="/dashboard" className="hover:underline flex items-center space-x-1">
              <ArrowLeft className="w-3 h-3" />
              <span>DASHBOARD</span>
            </Link>
            <span>/</span>
            <span>AI WORKSPACE</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tightest">
            One-Click Studio Workspace
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-scientific bg-ground-secondary border border-hairline font-mono-label text-xs">
            <span>AVAILABLE CREDITS: </span>
            <span className="text-accent-cyan font-bold">{availableCredits}</span>
          </div>
          {!hasSufficientCredits() && (
            <Link
              to="/pricing"
              className="px-3 py-1.5 rounded-scientific bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono-label text-xs hover:bg-amber-500/30"
            >
              BUY CREDITS
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, Live Result / Progress on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Photo & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-secondary">
              <span>[01] UPLOAD PRODUCT PHOTO</span>
              <span>JPG, PNG, WEBP (MAX 10MB)</span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              className={`relative border-2 border-dashed rounded-scientific-lg p-6 text-center cursor-pointer transition-all ${
                originalPreviewUrl
                  ? 'border-accent-cyan/50 bg-ground-secondary'
                  : 'border-hairline hover:border-accent-cyan/40 bg-ground-tertiary/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              {originalPreviewUrl ? (
                <div className="relative group">
                  <img
                    src={originalPreviewUrl}
                    alt="Uploaded Product"
                    className="max-h-56 mx-auto rounded border border-hairline object-contain"
                  />
                  <div className="mt-3 flex items-center justify-center space-x-2 font-mono-label text-[10px] text-accent-cyan">
                    <RefreshCw className="w-3 h-3" />
                    <span>CLICK OR DROP TO CHANGE IMAGE</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mx-auto flex items-center justify-center text-accent-cyan">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-semibold text-sm text-ink">
                      Drag & Drop your raw product image
                    </p>
                    <p className="text-xs text-ink-muted">
                      or click to browse from your device
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Style Controls */}
          <div className="space-y-4 rounded-scientific-lg p-5 bg-ground-secondary border border-hairline">
            <div className="font-mono-label text-[10px] text-accent-cyan">
              [02] BACKGROUND PRESET
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BACKGROUND_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-scientific text-left border transition-all ${
                    selectedStyle === style.id
                      ? 'bg-accent-cyan/10 border-accent-cyan text-ink shadow-[0_0_12px_rgba(79,216,232,0.15)]'
                      : 'bg-ground-tertiary border-hairline text-ink-secondary hover:border-ink/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-label text-[9px] text-accent-cyan mb-1">
                    <span>{style.tag}</span>
                    {selectedStyle === style.id && <Check className="w-3 h-3 text-accent-cyan" />}
                  </div>
                  <div className="font-heading font-bold text-xs text-ink">{style.name}</div>
                  <div className="text-[10px] text-ink-muted line-clamp-2 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>

            {/* Aspect Ratio & Quality Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-hairline">
              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="font-mono-label text-[9.5px] text-ink-secondary">ASPECT RATIO</label>
                <div className="flex space-x-1.5">
                  {(['1:1', '4:5', '16:9'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-1.5 rounded font-mono text-xs transition-colors border ${
                        aspectRatio === ratio
                          ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan font-bold'
                          : 'bg-ground-tertiary border-hairline text-ink-muted hover:text-ink'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Mode */}
              <div className="space-y-1.5">
                <label className="font-mono-label text-[9.5px] text-ink-secondary">RENDER QUALITY</label>
                <div className="flex space-x-1.5">
                  {(['standard', 'high'] as QualityMode[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`flex-1 py-1.5 rounded font-mono-label text-[10px] uppercase transition-colors border ${
                        quality === q
                          ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan font-bold'
                          : 'bg-ground-tertiary border-hairline text-ink-muted hover:text-ink'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insufficient Credits Banner */}
          {!hasSufficientCredits() && (
            <div className="p-4 rounded-scientific bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start space-x-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Insufficient Generation Credits</p>
                <p className="text-[11px] text-amber-300/80">
                  You don't have enough credits remaining. Please buy credits to generate professional images.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block mt-1 font-mono-label text-[10px] text-accent-cyan hover:underline font-bold"
                >
                  BUY CREDITS NOW →
                </Link>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-scientific bg-red-950/40 border border-red-500/40 text-red-300 font-mono-label text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main CTA Button */}
          <button
            onClick={handleStartGeneration}
            disabled={!originalPreviewUrl || status === 'ai-generating' || !hasSufficientCredits()}
            className={`w-full py-4 rounded-scientific-lg font-mono-label font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
              !originalPreviewUrl || !hasSufficientCredits()
                ? 'bg-ground-tertiary border border-hairline text-ink-muted cursor-not-allowed'
                : 'bg-accent-cyan text-ground hover:bg-accent-cyan/90 shadow-[0_0_24px_rgba(79,216,232,0.3)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>GENERATE PROFESSIONAL IMAGE • 1 CREDIT</span>
          </button>
        </div>

        {/* Right Column: Processing Animation / Before-After Result (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {status === 'ai-generating' || status === 'uploading' ? (
            /* Attractive Processing Screen */
            <div className="p-8 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-8 min-h-[460px] flex flex-col justify-center items-center text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center text-accent-cyan font-mono text-xs">
                  {progressPercent}%
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="font-heading font-bold text-xl text-ink">
                  AI E-Commerce Studio Engine
                </h3>
                <p className="font-mono-label text-xs text-accent-cyan animate-pulse">
                  {progressMsg}
                </p>
                <p className="text-xs text-ink-secondary">
                  Preserving product label details, shape, and colors while building ray-traced background geometry.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-ground-tertiary h-1.5 rounded-full overflow-hidden border border-hairline">
                <div
                  className="bg-accent-cyan h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="font-mono-label text-[9.5px] text-ink-muted">
                N8N WORKFLOW STREAM: VERIFIED • TENSOR PIPELINE RUNNING
              </div>
            </div>
          ) : status === 'completed' && resultImage ? (
            /* Result Experience: Before / After Comparison */
            <div className="space-y-4 p-6 rounded-scientific-lg bg-ground-secondary border border-hairline">
              <div className="flex items-center justify-between">
                <span className="font-mono-label text-[10px] text-accent-cyan">
                  [03] GENERATION COMPLETE
                </span>
                <StatusBadge status="completed" />
              </div>

              <BeforeAfterSlider
                originalUrl={originalPreviewUrl}
                generatedUrl={resultImage}
                aspectRatio={aspectRatio}
                onDownload={handleDownload}
                onRegenerate={() => {
                  setStatus('idle');
                  handleStartGeneration();
                }}
              />
            </div>
          ) : (
            /* Idle Placeholder View */
            <div className="p-12 rounded-scientific-lg bg-ground-tertiary/40 border border-hairline min-h-[460px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-ground-secondary border border-hairline flex items-center justify-center text-ink-muted">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="font-heading font-semibold text-base text-ink">
                  No Image Generated Yet
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Upload a photo on the left, select your e-commerce background preset, and click generate to preview your studio transformation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Creation Prompt Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
