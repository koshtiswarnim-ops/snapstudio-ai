import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import { openRazorpayCheckout } from '../services/razorpay';
import { PricingPlan } from '../types';

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'STARTER FREE',
    priceINR: 0,
    credits: 5,
    features: [
      '5 Free Initial Generation Credits',
      'Standard Quality Processing',
      'Basic Background Presets',
      '1:1 Aspect Ratio',
      'Standard Download Resolution',
    ],
  },
  {
    id: 'pro_monthly',
    name: 'PRO STUDIO',
    priceINR: 1499,
    credits: 60,
    badge: 'MOST POPULAR',
    recommended: true,
    features: [
      '60 High-Resolution Credits / Month',
      'Priority n8n Tensor Processing',
      'All 4 Studio Background Presets',
      'All Aspect Ratios (1:1, 4:5, 16:9)',
      '4K Ultra-HD Resolution Exports',
      'Full History Vault & Re-Generations',
    ],
  },
  {
    id: 'credit_pack_25',
    name: '25 CREDIT PACK',
    priceINR: 799,
    credits: 25,
    badge: 'PAY AS YOU GO',
    features: [
      '25 On-Demand Generation Credits',
      'Never Expires',
      'High-Resolution Studio Renders',
      'All Background Presets & Aspect Ratios',
      'Instant Download & Storage',
    ],
  },
];

export const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { addCredits } = useCredits();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string>('');

  const handlePurchase = (plan: PricingPlan) => {
    if (plan.priceINR === 0) {
      navigate('/generate');
      return;
    }

    setLoadingPlan(plan.id);
    setSuccessNotice('');

    openRazorpayCheckout({
      amountINR: plan.priceINR,
      planName: plan.name,
      credits: plan.credits,
      userEmail: user?.email || 'seller@snapstudio.ai',
      userName: user?.name || 'Valued Seller',
      onSuccess: (paymentId, orderId) => {
        addCredits(plan.credits);
        setLoadingPlan(null);
        setSuccessNotice(`Payment successful! ${plan.credits} Credits added to your account.`);
        setTimeout(() => navigate('/generate'), 2500);
      },
      onFailure: (errorMsg) => {
        setLoadingPlan(null);
        alert(`Payment error: ${errorMsg}`);
      },
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="font-mono-label text-[10px] text-accent-cyan tracking-monoWide">
          [COMMERCIAL MONETIZATION // RAZORPAY VERIFIED]
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tightest">
          Transparent Credit Packs & Pro Subscriptions
        </h1>
        <p className="text-ink-secondary text-sm sm:text-base leading-relaxed">
          No hidden fees or recurring lock-in. Pay only for the e-commerce photos you generate. Secured by Razorpay.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-scientific bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono-label text-xs text-center">
          {successNotice}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-scientific-lg p-8 bg-ground-card border flex flex-col justify-between transition-all ${
              plan.recommended
                ? 'border-accent-cyan shadow-[0_0_30px_rgba(79,216,232,0.2)] bg-ground-secondary'
                : 'border-hairline hover:border-ink/30'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-accent-cyan text-ground font-mono-label font-bold text-[9px] uppercase tracking-monoLabel">
                {plan.badge}
              </div>
            )}

            <div className="space-y-6">
              {/* Plan Title & Price */}
              <div className="space-y-2 border-b border-hairline pb-6">
                <h3 className="font-mono-label text-xs text-ink-muted uppercase">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-4xl font-bold text-ink">
                    ₹{plan.priceINR.toLocaleString('en-IN')}
                  </span>
                  {plan.priceINR > 0 && <span className="font-mono-label text-[10px] text-ink-muted">/ INC TAX</span>}
                </div>
                <div className="font-mono-label text-[11px] text-accent-cyan font-bold pt-1">
                  INCLUDES {plan.credits} CREDITS
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 font-mono-label text-[10px] text-ink-secondary">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={() => handlePurchase(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3.5 rounded-scientific font-mono-label font-bold text-xs transition-all ${
                  plan.recommended
                    ? 'bg-accent-cyan text-ground hover:bg-accent-cyan/90 shadow-md'
                    : 'bg-ground-tertiary border border-hairline text-ink hover:border-accent-cyan/50'
                }`}
              >
                {loadingPlan === plan.id
                  ? 'INITIATING RAZORPAY...'
                  : plan.priceINR === 0
                  ? 'GET STARTED FREE'
                  : `PURCHASE FOR ₹${plan.priceINR}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
