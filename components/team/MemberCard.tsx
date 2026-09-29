'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Member } from '@/types';

interface MemberCardProps {
  member: Member;
  index: number;
}

export default function MemberCard({ member, index }: MemberCardProps) {
  const reducedMotion = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsRevealed((v) => !v);
      }
      if (e.key === 'Escape' && isRevealed) {
        e.preventDefault();
        setIsRevealed(false);
      }
    },
    [isRevealed]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) setIsRevealed(false);
    },
    []
  );

  const socials = [
    member.socials.linkedin && { label: 'LinkedIn', url: member.socials.linkedin },
    member.socials.github && { label: 'GitHub', url: member.socials.github },
    member.socials.instagram && { label: 'Instagram', url: member.socials.instagram },
    member.socials.twitter && { label: 'X', url: member.socials.twitter },
  ].filter((s): s is { label: string; url: string } => Boolean(s));

  return (
    <div
      ref={cardRef}
      className="relative w-full"
      style={{ perspective: 1200 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${member.name}, ${member.role}`}
      aria-expanded={isRevealed}
    >
      {/* Front: portrait + name/role */}
      <motion.div
        layout
        initial={reducedMotion ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, delay: index * 0.08 }}
        className={`relative overflow-visible border border-white/10 bg-surface-900/50 ${reducedMotion ? '' : 'group-hover/card:border-brand-400/30'} transition-colors duration-500`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative w-full aspect-[3/4] overflow-visible">
          <img
            src={member.image}
            alt=""
            className="w-full h-full object-cover opacity-70 group-hover/card:opacity-90 transition-opacity duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <h3 className="font-display text-lg font-bold text-white leading-tight tracking-tight">
              {member.name}
            </h3>
            <p className="font-body text-xs text-brand-400 mt-1 font-semibold tracking-wide uppercase">
              {member.role}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {member.department}
            </p>
          </div>
        </div>
        <div className="px-6 pb-5">
          <span className="font-display text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-400/70">
            Year {member.year}
          </span>
        </div>
      </motion.div>

      {/* Desktop hover flip overlay */}
      {!isRevealed && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none md:pointer-events-auto"
          initial={false}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="absolute inset-0 border border-white/20 bg-surface-900/95 backdrop-blur-xl p-6 glass-strong"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, rotateY: 15 }}
            whileHover={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transform: 'rotateY(0deg) translateZ(30px)' }}
          >
            <div className="mb-4">
              <p className="font-display text-sm font-bold text-white">{member.name}</p>
              <p className="font-body text-[10px] text-brand-400 mt-0.5">
                {member.role} · {member.department}
              </p>
            </div>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">
              {member.bio}
            </p>
            <div className="mb-3">
              <p className="font-display text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Contributions
              </p>
              {member.contributions.map((c, i) => (
                <p key={i} className="font-body text-[11px] text-white/70 flex items-start gap-1.5">
                  <span className="text-brand-400 shrink-0">&#9670;</span>
                  {c}
                </p>
              ))}
            </div>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className="w-7 h-7 flex items-center justify-center border border-white/10 bg-surface-800 hover:border-brand-400/40 hover:bg-brand-600/15 transition-all text-white/50 hover:text-brand-400"
                    aria-label={`${member.name} on ${s.label}`}
                  >
                    <SocialIcon name={s.label} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Mobile revealed content */}
      <AnimatePresence>
        {isRevealed && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRevealed(false)}
              aria-hidden="true"
            />
            <motion.div
              className="relative border border-white/15 bg-surface-900/95 backdrop-blur-xl p-5 mt-2 md:absolute md:inset-0 md:mt-0 md:p-6"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center border border-white/10 bg-surface-800 text-white/50 hover:text-white transition-colors"
                onClick={() => setIsRevealed(false)}
                aria-label="Close details"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="mb-3">
                <p className="font-display text-base font-bold text-white">{member.name}</p>
                <p className="font-body text-xs text-brand-400 mt-0.5">
                  {member.role} · {member.department}
                </p>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">
                {member.bio}
              </p>
              <div className="mb-3">
                <p className="font-display text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Contributions
                </p>
                {member.contributions.map((c, i) => (
                  <p key={i} className="font-body text-xs text-white/70 flex items-start gap-1.5 mb-0.5">
                    <span className="text-brand-400 shrink-0">&#9670;</span>
                    {c}
                  </p>
                ))}
              </div>
              {socials.length > 0 && (
                <div className="flex items-center gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      className="w-7 h-7 flex items-center justify-center border border-white/10 bg-surface-800 hover:border-brand-400/40 hover:bg-brand-600/15 transition-all text-white/50 hover:text-brand-400"
                      aria-label={`${member.name} on ${s.label}`}
                    >
                      <SocialIcon name={s.label} />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile tap button */}
      <button
        className="md:hidden flex w-full items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-surface-900/40 hover:bg-surface-800/60 text-[11px] font-display font-medium text-white/50 hover:text-white transition-all"
        onClick={() => setIsRevealed(!isRevealed)}
        aria-label={isRevealed ? `Hide details for ${member.name}` : `Show details for ${member.name}`}
      >
        {isRevealed ? 'Hide Details' : 'Show Details'}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-300 ${isRevealed ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    LinkedIn: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ),
    GitHub: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
    ),
    Instagram: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ),
    X: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
  };
  return icons[name] || null;
}
