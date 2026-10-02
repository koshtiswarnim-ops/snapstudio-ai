import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-4xl mx-auto space-y-8">
      <div className="border-b border-hairline pb-4 space-y-2">
        <div className="font-mono-label text-[10px] text-accent-cyan">LEGAL COMPLIANCE // DOCUMENT REF: PRIV_2026</div>
        <h1 className="font-heading font-extrabold text-3xl text-ink tracking-tightest">Privacy Policy</h1>
        <p className="font-mono-label text-[10px] text-ink-muted">LAST REVISED: OCTOBER 1, 2026</p>
      </div>

      <div className="space-y-6 text-sm text-ink-secondary leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">1. Data Collection & Processing Scope</h2>
          <p>
            SnapStudio AI processes user-provided product photographs solely for generating enhanced e-commerce imagery. Uploaded product images are temporarily cached in encrypted cloud storage for processing via n8n automation webhooks and AI image providers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">2. Product Image Ownership & Retention</h2>
          <p>
            Users retain 100% intellectual property rights and full commercial ownership of both original and AI-generated e-commerce images. We do not use your proprietary product photos for training public AI foundation models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-ink">3. Payment & Authentication Security</h2>
          <p>
            Authentication is secured via Supabase Auth with Row Level Security (RLS) policies enforcing tenant isolation. All financial transactions are handled via Razorpay’s 256-bit encrypted checkout. SnapStudio AI never stores raw credit card details or payment credentials.
          </p>
        </section>
      </div>
    </div>
  );
};
