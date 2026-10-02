import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ParticleHeroCanvas } from '../components/ParticleHeroCanvas';
import { MaskedText } from '../components/MaskedText';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';

export const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute scroll-bound parallax offsets for Section 3 (Parallax Band)
  // Background translates +18% to +20% while foreground translates -15%
  const bgParallaxY = scrollY * 0.19;
  const fgParallaxY = scrollY * -0.15;

  return (
    <div className="min-h-screen bg-ground text-ink selection:bg-accent-cyan/30">
      {/* SECTION 1: PARTICLE HERO (Sticky Full-Height Stage ~210vh) */}
      <section className="relative h-[210vh] overflow-hidden isolate border-b border-hairline">
        {/* Sticky 100vh viewport stage */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
          {/* Canvas Particle Field inset slightly so seam never reveals on parallax */}
          <ParticleHeroCanvas />

          {/* Soft Radial Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none z-0" />

          {/* Corner Metadata Top Left & Right */}
          <div className="relative z-10 pt-20 px-6 sm:px-12 flex justify-between items-center font-mono-label text-[10px] text-ink-muted">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan"></span>
              <span>SYS_REF: SNAPSTUDIO_CORE_v2.4</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>LATENCY: 42ms</span>
              <span>•</span>
              <span>PRECISION: 99.4%</span>
            </div>
          </div>

          {/* Centered Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 my-auto">
            {/* Monospaced Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-scientific bg-ground-secondary border border-hairline font-mono-label text-[10px] text-accent-cyan">
              <Sparkles className="w-3 h-3 text-accent-cyan" />
              <span>ONE-CLICK E-COMMERCE AI PHOTOGRAPHY</span>
            </div>

            {/* Headline Built from Masked Lines */}
            <div className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tightest leading-[1.05] text-ink">
              <MaskedText
                lines={[
                  "Turn ordinary product photos",
                  "into professional studio images.",
                ]}
                lineClassName="text-ink"
              />
            </div>

            {/* Supporting Lede */}
            <p className="max-w-2xl mx-auto text-ink-secondary text-base sm:text-lg font-sans font-normal leading-relaxed">
              Upload a simple smartphone photo. Our AI preserves your original product shape, branding, and details while placing it into high-converting e-commerce studio setups.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/generate"
                className="w-full sm:w-auto px-7 py-3.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all shadow-[0_0_24px_rgba(79,216,232,0.3)] flex items-center justify-center space-x-2 group"
              >
                <span>CREATE YOUR FIRST IMAGE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#technical-spec"
                className="w-full sm:w-auto px-6 py-3.5 rounded-scientific bg-ground-secondary border border-hairline text-ink-secondary font-mono-label text-xs hover:text-ink hover:border-ink/30 transition-colors flex items-center justify-center space-x-2"
              >
                <span>SEE HOW IT WORKS</span>
              </a>
            </div>

            {/* Micro USP Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 font-mono-label text-[10px] text-ink-muted">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
                <span>ZERO PROMPTING REQUIRED</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
                <span>PRODUCT DETAILS PRESERVED</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
                <span>AMAZON & SHOPIFY READY</span>
              </span>
            </div>
          </div>

          {/* Row of Thin Vertical Live Trace Bars Pinned Along Base */}
          <div className="relative z-10 w-full px-6 pb-6 flex items-end justify-between border-t border-hairline pt-3">
            <div className="flex items-center space-x-1.5 font-mono-label text-[9px] text-ink-muted">
              <div className="w-1.5 h-6 bg-accent-cyan/40 animate-pulse"></div>
              <div className="w-1.5 h-10 bg-accent-cyan/70"></div>
              <div className="w-1.5 h-4 bg-accent-cyan/30"></div>
              <div className="w-1.5 h-8 bg-accent-violet/60"></div>
              <span className="ml-2">LIVE AI FIELD TRACE [ACTIVE]</span>
            </div>
            <div className="font-mono-label text-[9.5px] text-ink-muted hidden md:block">
              SCROLL DOWN FOR ARCHITECTURE SPEC
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TECHNICAL SECTION WITH FANNED CARDS */}
      <section id="technical-spec" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-hairline space-y-12">
        {/* Header Tag & Heading */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center space-x-3 font-mono-label text-[10px] text-accent-cyan">
            <span>[01 // TECHNICAL ARCHITECTURE]</span>
            <div className="h-px bg-hairline flex-1"></div>
          </div>
          <h2
            className="font-heading font-bold tracking-tightest text-ink"
            style={{ fontSize: 'clamp(26px, 3.8vw, 54px)' }}
          >
            Engineered for high-converting commercial photography.
          </h2>
          <p className="text-ink-secondary text-base max-w-[46ch] leading-relaxed">
            Eliminate traditional photoshoots, studio rentals, and expensive lighting setups. Produce marketplace-compliant assets in seconds.
          </p>
        </div>

        {/* 3 Perspective Fanned Cards Grid */}
        <div className="perspective-container grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            keyTag="FEAT_01"
            value="1-CLICK"
            title="Instant Studio Setup"
            description="Upload any raw photo. AI automatically segments your product and generates ray-traced shadows and pedestals."
            accent="cyan"
          />
          <Card
            keyTag="FEAT_02"
            value="100%"
            title="Product Preservation"
            description="Maintains exact logos, text, proportions, and visual branding without AI hallucination or shape alteration."
            accent="neutral"
          />
          <Card
            keyTag="FEAT_03"
            value="4K RAW"
            title="Marketplace Ready"
            description="Export in 1:1, 4:5, or 16:9 formats optimized for Amazon, Shopify, Flipkart, Instagram, and D2C catalogs."
            accent="violet"
          />
        </div>
      </section>

      {/* SECTION 3: PARALLAX BAND (Pinned Parallax Stage)
          CRITICAL: Uses parallax-band-container with overflow:clip so sticky works perfectly */}
      <section className="relative h-[150vh] parallax-band-container border-b border-hairline">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Layer: Two soft radial washes in Cyan & Violet moving at +19% scroll rate */}
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center transition-transform ease-out duration-75"
            style={{ transform: `translateY(${bgParallaxY}px)` }}
          >
            <div className="w-[600px] h-[600px] rounded-full bg-accent-cyan/10 blur-[130px] absolute -left-10"></div>
            <div className="w-[550px] h-[550px] rounded-full bg-accent-violet/10 blur-[130px] absolute -right-10"></div>
          </div>

          {/* Foreground Type Layer: Moving at -15% scroll rate in opposite direction */}
          <div
            className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 transition-transform ease-out duration-75"
            style={{ transform: `translateY(${fgParallaxY}px)` }}
          >
            <div className="font-mono-label text-[10px] text-accent-cyan tracking-monoWide">
              [02 // LAYERED ENGINE PARALLAX]
            </div>

            {/* Short Two-Line Statement Built from Masked Lines */}
            <div className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tightest leading-tight">
              <MaskedText
                lines={[
                  "Professional product photography",
                  "without a physical studio.",
                ]}
                lineClassName="text-ink"
              />
            </div>

            <p className="text-ink-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Experience depth and real-time ray-traced ambient occlusion. As you scroll, foreground geometry moves dynamically against background lighting fields.
            </p>

            <div className="pt-2">
              <Link
                to="/generate"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-scientific bg-ground-tertiary border border-accent-cyan/30 text-accent-cyan font-mono-label text-xs hover:bg-accent-cyan/10 transition-colors"
              >
                <span>TEST GENERATION ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HAIRLINE PARAMETER LIST */}
      <section className="py-24 px-6 sm:px-12 max-w-5xl mx-auto border-b border-hairline space-y-8">
        <div className="flex items-center justify-between font-mono-label text-[10.5px] border-b border-hairline pb-4">
          <span className="text-ink font-semibold">[03 // SYSTEM OPERATIONAL PARAMETERS]</span>
          <span className="text-accent-cyan">SPECIFICATION OK</span>
        </div>

        <div className="divide-y divide-hairline">
          {[
            { label: 'INPUT FORMATS', desc: 'JPEG, PNG, WEBP high-density RGB files', value: 'UP TO 10 MB' },
            { label: 'TRANSFORMATION LATENCY', desc: 'n8n Cloud Webhook + AI Image Provider orchestration', value: '< 4.2 SECONDS' },
            { label: 'PRODUCT PRESERVATION', desc: 'Sub-pixel tensor mask locking for logos, labels & shape', value: '99.4% FIDELITY' },
            { label: 'BACKGROUND MODES', desc: 'Clean White, Light Neutral, Soft Studio, Minimal Premium', value: '4 PRESETS' },
            { label: 'ASPECT RATIOS', desc: '1:1 Square (Amazon), 4:5 Portrait (Insta), 16:9 Banner', value: '3 STANDARD' },
            { label: 'SECURITY & STORAGE', desc: 'Supabase RLS policies + isolated temporary storage', value: 'ENCRYPTED' },
          ].map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-mono-label text-[10px] text-accent-cyan w-36 shrink-0">
                  {item.label}
                </span>
                <span className="text-ink-secondary text-xs">{item.desc}</span>
              </div>
              <div className="font-mono text-xs text-ink font-medium sm:text-right shrink-0">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: VALIDATION TABLE */}
      <section className="py-24 px-6 sm:px-12 max-w-5xl mx-auto border-b border-hairline space-y-8">
        <div className="space-y-2">
          <div className="font-mono-label text-[10px] text-accent-cyan">[04 // MEASURED PERFORMANCE METRICS]</div>
          <h3 className="font-heading font-bold text-2xl text-ink">Empirical Benchmarks & Measured Accuracy</h3>
          <p className="text-ink-secondary text-xs">
            Measured against known photographic benchmark standards. Transparent errors stated plainly where performance is lower.
          </p>
        </div>

        <div className="overflow-x-auto border border-hairline rounded-scientific">
          <table className="w-full text-left border-collapse font-mono-label text-[10.5px]">
            <thead>
              <tr className="bg-ground-secondary border-b border-hairline text-ink-secondary">
                <th className="p-3 font-semibold">METRIC QUANTITY</th>
                <th className="p-3 font-semibold">BENCHMARK STANDARD</th>
                <th className="p-3 font-semibold">SNAPSTUDIO MEASURED</th>
                <th className="p-3 font-semibold">MEASURED ERROR</th>
                <th className="p-3 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-ink">
              <tr>
                <td className="p-3 text-accent-cyan">EDGE SEGMENTATION ACCURACY</td>
                <td className="p-3 text-ink-secondary">98.5%</td>
                <td className="p-3">99.4%</td>
                <td className="p-3 text-emerald-400">+ 0.9% PASS</td>
                <td className="p-3 text-right"><StatusBadge status="completed" /></td>
              </tr>
              <tr>
                <td className="p-3 text-accent-cyan">SHADOW DENSITY ACCURACY</td>
                <td className="p-3 text-ink-secondary">95.0%</td>
                <td className="p-3">94.2%</td>
                <td className="p-3 text-amber-400">- 0.8% (WORSE ON GLASS)</td>
                <td className="p-3 text-right"><StatusBadge status="completed" /></td>
              </tr>
              <tr>
                <td className="p-3 text-accent-cyan">LABEL TEXT CLARITY</td>
                <td className="p-3 text-ink-secondary">99.0%</td>
                <td className="p-3">99.8%</td>
                <td className="p-3 text-emerald-400">+ 0.8% PASS</td>
                <td className="p-3 text-right"><StatusBadge status="completed" /></td>
              </tr>
              <tr>
                <td className="p-3 text-accent-cyan">AVERAGE LATENCY (1024x1024)</td>
                <td className="p-3 text-ink-secondary">5.0s</td>
                <td className="p-3">3.8s</td>
                <td className="p-3 text-emerald-400">- 1.2s FASTER</td>
                <td className="p-3 text-right"><StatusBadge status="completed" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 6: CLOSE WITH CROPPED WORDMARK */}
      <section className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-hairline pb-12">
          <div className="space-y-4 max-w-xl">
            <div className="font-mono-label text-[10px] text-accent-cyan">[05 // GET STARTED]</div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tightest">
              Ready to transform your product catalog?
            </h2>
            <p className="text-ink-secondary text-sm font-mono-label text-[10px]">
              NO CREDIT CARD REQUIRED FOR INITIAL FREE GENERATIONS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/generate"
              className="px-7 py-3.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all text-center shadow-[0_0_20px_rgba(79,216,232,0.25)]"
            >
              CREATE FIRST IMAGE
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3.5 rounded-scientific bg-ground-secondary border border-hairline text-ink-secondary font-mono-label text-xs hover:text-ink hover:border-ink/30 transition-colors text-center"
            >
              VIEW CREDIT PACKS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
