import React from 'react';

interface CardProps {
  keyTag: string;
  value: string;
  title: string;
  description: string;
  className?: string;
  accent?: 'cyan' | 'violet' | 'neutral';
}

export const Card: React.FC<CardProps> = ({
  keyTag,
  value,
  title,
  description,
  className = '',
  accent = 'neutral',
}) => {
  const getAccentBorder = () => {
    switch (accent) {
      case 'cyan':
        return 'border-accent-cyan/40 hover:border-accent-cyan/80';
      case 'violet':
        return 'border-accent-violet/40 hover:border-accent-violet/80';
      default:
        return 'border-hairline hover:border-ink/25';
    }
  };

  return (
    <div
      className={`relative p-6 rounded-scientific-lg bg-ground-card border ${getAccentBorder()} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] group ${className}`}
    >
      {/* Corner metadata key */}
      <div className="flex items-center justify-between font-mono-label text-[10px] text-ink-muted mb-4 border-b border-hairline pb-2">
        <span>[{keyTag}]</span>
        <span className="group-hover:text-accent-cyan transition-colors">SPEC_OK</span>
      </div>

      {/* Large Tabular Value */}
      <div className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-2">
        {value}
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-lg text-ink mb-1 group-hover:text-accent-cyan transition-colors">
        {title}
      </h3>

      {/* Line of prose */}
      <p className="text-sm text-ink-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};
