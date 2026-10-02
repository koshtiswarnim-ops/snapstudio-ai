import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-4xl mx-auto space-y-8">
      <div className="border-b border-hairline pb-4 space-y-2">
        <div className="font-mono-label text-[10px] text-accent-cyan">LEGAL COMPLIANCE // DOCUMENT REF: TOS_2026</div>
        <h1 className="font-heading font-extrabold text-3xl text-ink tracking-tightest">Terms of Service</h1>
        <p className="font-mono-label text-[10px] text-ink-muted">EFFECTIVE DATE: OCTOBER 1, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-ink-secondary leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SnapStudio AI, you agree to be bound by these Terms of Service. SnapStudio AI provides one-click AI product photography services intended strictly for commercial e-commerce sellers, catalogs, and online marketplaces.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">2. Credit Usage & Refund Policy</h2>
          <p>
            Each successful AI product image generation deducts 1 credit from your available balance. Credits purchased via Razorpay credit packs or subscriptions are non-refundable once consumed. Failed workflow requests are automatically credited back.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">3. Acceptable Use Policy</h2>
          <p>
            Users must not upload illegal, counterfeit, fraudulent, or harmful content. SnapStudio AI reserves the right to terminate accounts violating commercial guidelines.
          </p>
        </section>
      </div>
    </div>
  );
};
