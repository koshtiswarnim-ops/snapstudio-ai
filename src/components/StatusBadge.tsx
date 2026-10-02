import React from 'react';
import { GenerationStatus } from '../types';

interface StatusBadgeProps {
  status: GenerationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'READY • VERIFIED',
          bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
        };
      case 'ai-generating':
      case 'processing':
      case 'uploading':
      case 'finalizing':
        return {
          label: status.toUpperCase().replace('-', ' '),
          bg: 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan',
          dot: 'bg-accent-cyan animate-pulse',
        };
      case 'failed':
        return {
          label: 'FAILED',
          bg: 'bg-red-950/40 border-red-500/30 text-red-400',
          dot: 'bg-red-400',
        };
      default:
        return {
          label: 'IDLE',
          bg: 'bg-ground-tertiary border-hairline text-ink-muted',
          dot: 'bg-ink-muted',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-scientific border font-mono-label text-[9.5px] ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      <span>{config.label}</span>
    </span>
  );
};
