import React, { useEffect, useRef, useState } from 'react';

interface MaskedTextProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  staggerMs?: number;
}

export const MaskedText: React.FC<MaskedTextProps> = ({
  lines,
  className = '',
  lineClassName = '',
  as = 'h1',
  staggerMs = 80,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const inViewOnLoad = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewOnLoad) {
      requestAnimationFrame(() => {
        setIsRevealed(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const Component = as as any;

  return (
    <Component ref={containerRef} className={`inline-block ${className}`}>
      {lines.map((line, idx) => (
        <span
          key={idx}
          className={`masked-line-container ${isRevealed ? 'is-revealed' : ''}`}
        >
          <span
            className={`masked-line-inner ${lineClassName}`}
            style={{
              transitionDelay: `${idx * staggerMs}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
};
