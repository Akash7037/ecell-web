'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

export function DynamicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smoothing
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Subtle fluid floating orbs in warm champagne, amber, vermilion mist
    const orbs: Orb[] = [
      { x: width * 0.25, y: height * 0.3, radius: 280, vx: 0.2, vy: 0.15, color: 'rgba(255, 77, 46, 0.04)', alpha: 0.04 },
      { x: width * 0.75, y: height * 0.4, radius: 340, vx: -0.15, vy: 0.2, color: 'rgba(235, 215, 190, 0.45)', alpha: 0.45 },
      { x: width * 0.5, y: height * 0.7, radius: 300, vx: 0.1, vy: -0.18, color: 'rgba(224, 206, 178, 0.35)', alpha: 0.35 },
      { x: width * 0.85, y: height * 0.8, radius: 250, vx: -0.2, vy: -0.12, color: 'rgba(255, 77, 46, 0.03)', alpha: 0.03 },
    ];

    // Minimal kinetic particles (interactive dust)
    const particleCount = Math.min(Math.floor((width * height) / 25000), 50);
    const particles: Particle[] = [];

    const colors = [
      'rgba(18, 19, 22, 0.15)',
      'rgba(255, 77, 46, 0.25)',
      'rgba(140, 120, 100, 0.2)',
    ];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = 0.1 + Math.random() * 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 1.5,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render ambient fluid orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x - orb.radius < 0 || orb.x + orb.radius > width) orb.vx *= -1;
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > height) orb.vy *= -1;

        // Mouse slight parallax
        const dx = (mouse.x - width / 2) * 0.03;
        const dy = (mouse.y - height / 2) * 0.03;

        const gradient = ctx.createRadialGradient(
          orb.x + dx,
          orb.y + dy,
          0,
          orb.x + dx,
          orb.y + dy,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x + dx, orb.y + dy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render kinetic particles and subtle filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse
        const distMouse = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (distMouse < 120) {
          p.alpha = Math.min(1, p.baseAlpha + (1 - distMouse / 120) * 0.4);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Subtle connecting filament lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(18, 19, 22, 0.04)';
            ctx.lineWidth = 0.75 * (1 - dist / 100);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ mixBlendMode: 'multiply' }}
      aria-hidden="true"
    />
  );
}
