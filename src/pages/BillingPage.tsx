import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Download, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';

export const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const { availableCredits, totalUsed } = useCredits();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockPayments = [
    {
      id: 'pay_M90129481',
      order_id: 'order_89218491',
      amount: 1499,
      credits: 60,
      plan: 'Pro Studio Monthly',
      status: 'paid',
      date: '2026-09-28',
    },
    {
      id: 'pay_M77192841',
      order_id: 'order_77192811',
      amount: 799,
      credits: 25,
      plan: '25 Credit Pack',
      status: 'paid',
      date: '2026-09-14',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-ground text-ink max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="font-mono-label text-[10px] text-accent-cyan mb-1">
            ACCOUNT BILLING & TRANSACTIONS
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tightest">
            Billing & Credit Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-scientific bg-ground-secondary border border-hairline hover:border-accent-cyan/40 text-ink-secondary hover:text-ink transition-all flex items-center gap-1.5 font-mono-label text-xs"
            title="Refresh transaction status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-cyan' : ''}`} />
            <span className="hidden sm:inline">SYNC</span>
          </button>
          <Link
            to="/pricing"
            className="px-4 py-2.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-colors shadow-[0_0_16px_rgba(79,216,232,0.25)] flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>BUY MORE CREDITS</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>CURRENT PLAN</span>
            <CreditCard className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="font-mono text-2xl font-bold text-accent-cyan uppercase">
            {user?.plan || 'PRO STUDIO'}
          </div>
          <p className="text-xs text-ink-secondary">High Priority Tensor Processing Active</p>
        </div>

        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>AVAILABLE CREDITS</span>
            <Zap className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="font-mono text-2xl font-bold text-ink">
            {availableCredits} CREDITS
          </div>
          <p className="text-xs text-ink-secondary">Used {totalUsed} credits total</p>
        </div>

        <div className="p-6 rounded-scientific-lg bg-ground-secondary border border-hairline space-y-2">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted">
            <span>GATEWAY PROVIDER</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">
            RAZORPAY SECURE
          </div>
          <p className="text-xs text-ink-secondary">256-bit Encrypted Webhook Verification</p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono-label text-[10.5px] text-ink">
          <span>PAST RAZORPAY TRANSACTIONS</span>
          <span className="text-ink-muted">SHOWING RECENT SETTLED CHARGES</span>
        </div>

        <div className="overflow-x-auto border border-hairline rounded-scientific">
          <table className="w-full text-left border-collapse font-mono-label text-[10.5px]">
            <thead>
              <tr className="bg-ground-secondary border-b border-hairline text-ink-secondary">
                <th className="p-3">PAYMENT ID</th>
                <th className="p-3">ORDER ID</th>
                <th className="p-3">ITEM / PLAN</th>
                <th className="p-3">CREDITS</th>
                <th className="p-3">AMOUNT</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-ink">
              {mockPayments.map((p) => (
                <tr key={p.id} className="hover:bg-ground-secondary/50 transition-colors">
                  <td className="p-3 font-mono text-accent-cyan">{p.id}</td>
                  <td className="p-3 text-ink-muted">{p.order_id}</td>
                  <td className="p-3 font-sans text-xs font-semibold">{p.plan}</td>
                  <td className="p-3 text-accent-cyan font-bold">+{p.credits}</td>
                  <td className="p-3 font-mono">₹{p.amount}</td>
                  <td className="p-3 text-emerald-400">PAID • VERIFIED</td>
                  <td className="p-3 text-right">
                    <button
                      className="p-1.5 rounded hover:bg-hairline text-ink-muted hover:text-accent-cyan transition-colors"
                      title="Download Tax Invoice"
                      onClick={() => alert(`Downloading invoice for payment ${p.id}`)}
                    >
                      <Download className="w-3.5 h-3.5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
