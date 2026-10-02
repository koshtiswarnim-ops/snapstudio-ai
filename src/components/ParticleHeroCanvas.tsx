import React, { useEffect, useRef } from 'react';

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  depth: number; // 0.2 to 1.0
  size: number;
  alpha: number;
}

export const ParticleHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const initCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Seed particles proportional to canvas area
      const area = width * height;
      const particleCount = Math.floor(Math.min(Math.max(area / 4500, 120), 320));

      const minRadius = Math.min(width, height) * 0.15;
      const maxRadius = Math.min(width, height) * 0.45;

      particles = Array.from({ length: particleCount }, () => {
        const depth = 0.2 + Math.random() * 0.8;
        return {
          angle: Math.random() * Math.PI * 2,
          radius: minRadius + Math.random() * (maxRadius - minRadius),
          speed: (0.0008 + Math.random() * 0.0018) * (Math.random() > 0.5 ? 1 : -1),
          depth,
          size: 1.2 + depth * 2.2,
          alpha: 0.25 + depth * 0.65,
        };
      });
    };

    initCanvasSize();

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const tiltFactor = 0.42; // Squashes Y to read as a disc seen at an angle

      // Draw faint center glowing subject field ring
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.min(width, height) * 0.4);
      gradient.addColorStop(0, 'rgba(79, 216, 232, 0.14)');
      gradient.addColorStop(0.5, 'rgba(139, 111, 232, 0.06)');
      gradient.addColorStop(1, 'rgba(6, 7, 10, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Sort by depth so background particles render behind foreground ones
      particles.sort((a, b) => a.depth - b.depth);

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.angle += p.speed;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius * tiltFactor;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        // Cyan / Violet particle accenting based on depth
        if (p.depth > 0.75) {
          ctx.fillStyle = `rgba(79, 216, 232, ${p.alpha})`; // Cyan
        } else if (p.depth > 0.5) {
          ctx.fillStyle = `rgba(139, 111, 232, ${p.alpha})`; // Violet
        } else {
          ctx.fillStyle = `rgba(230, 234, 240, ${p.alpha * 0.75})`; // Ink
        }

        ctx.fill();

        // Connect nearby particles with subtle hairlines
        for (const p2 of particles) {
          if (p === p2) continue;
          const x2 = centerX + Math.cos(p2.angle) * p2.radius;
          const y2 = centerY + Math.sin(p2.angle) * p2.radius * tiltFactor;
          const dx = x - x2;
          const dy = y - y2;
          const distSq = dx * dx + dy * dy;

          if (distSq < 2800 && p.depth > 0.6) {
            const lineAlpha = (1 - distSq / 2800) * 0.12 * p.depth;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(79, 216, 232, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    };

    const renderLoop = () => {
      if (isVisible.current && !prefersReducedMotion) {
        drawFrame();
        animationFrameId.current = requestAnimationFrame(renderLoop);
      }
    };

    if (prefersReducedMotion) {
      drawFrame(); // Draw ONE static frame as specified by prompt
    } else {
      renderLoop();
    }

    // IntersectionObserver to pause loop when off screen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting && !prefersReducedMotion) {
          if (!animationFrameId.current) {
            renderLoop();
          }
        } else {
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    const handleResize = () => {
      initCanvasSize();
      drawFrame();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
};
