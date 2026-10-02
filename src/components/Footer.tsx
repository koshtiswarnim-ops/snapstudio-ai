import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-ground border-t border-hairline overflow-hidden pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-hairline">
          {/* Col 1: Brand USP */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
              <span className="font-heading font-bold text-lg text-ink">SnapStudio AI</span>
            </div>
            <p className="text-ink-secondary text-sm max-w-md leading-relaxed">
              Turn ordinary product photos into professional e-commerce studio imagery in one click. Optimized for Amazon, Shopify, Flipkart, and direct-to-consumer online sellers.
            </p>
            <div className="font-mono-label text-[10px] text-ink-muted flex items-center space-x-4 pt-2">
              <span>EST. 2026</span>
              <span>•</span>
              <span>SCIENTIFIC INSTRUMENT SPEC v2.4</span>
              <span>•</span>
              <span className="text-accent-cyan">STATUS: OPERATIONAL</span>
            </div>
          </div>

          {/* Col 2: Workspace Links */}
          <div className="space-y-3">
            <h4 className="font-mono-label text-[10.5px] text-ink font-semibold">PRODUCT WORKSPACE</h4>
            <ul className="space-y-2 font-mono-label text-[10px] text-ink-secondary">
              <li><Link to="/generate" className="hover:text-accent-cyan transition-colors">ONE-CLICK STUDIO</Link></li>
              <li><Link to="/history" className="hover:text-accent-cyan transition-colors">GENERATION HISTORY</Link></li>
              <li><Link to="/pricing" className="hover:text-accent-cyan transition-colors">PRICING & CREDITS</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent-cyan transition-colors">ACCOUNT DASHBOARD</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Docs */}
          <div className="space-y-3">
            <h4 className="font-mono-label text-[10.5px] text-ink font-semibold">COMPLIANCE & LEGAL</h4>
            <ul className="space-y-2 font-mono-label text-[10px] text-ink-secondary">
              <li><Link to="/privacy" className="hover:text-accent-cyan transition-colors">PRIVACY POLICY</Link></li>
              <li><Link to="/terms" className="hover:text-accent-cyan transition-colors">TERMS OF SERVICE</Link></li>
              <li><span className="text-ink-muted cursor-not-allowed">N8N ARCHITECTURE API</span></li>
              <li><span className="text-ink-muted cursor-not-allowed">RAZORPAY VERIFIED</span></li>
            </ul>
          </div>
        </div>

        {/* Fine-print bar */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between font-mono-label text-[9.5px] text-ink-muted space-y-2 sm:space-y-0">
          <div>© {new Date().getFullYear()} SNAPSTUDIO AI INC. ALL RIGHTS RESERVED.</div>
          <div>POWERED BY REACT + SUPABASE + N8N CLOUD</div>
        </div>

        {/* Cropped Full-Width Wordmark at Page Bottom Edge */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden select-none pointer-events-none text-center">
          <h1
            className="font-heading font-black tracking-tightest text-ground-tertiary uppercase leading-none opacity-80"
            style={{
              fontSize: 'clamp(58px, 15.5vw, 232px)',
              transform: 'translateY(0.16em)',
            }}
          >
            SNAPSTUDIO
          </h1>
        </div>
      </div>
    </footer>
  );
};
