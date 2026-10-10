'use client';

import Button from './Button';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { isEventConcluded } from '@/lib/eventUtils';

export interface Event {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  isFree: boolean;
  date: string;
  time: string;
  location?: string;
  registrationUrl?: string;
  imageUrl?: string;
  gallery?: string[];
  isConcluded?: boolean;
  isComingSoon?: boolean;
  isRegistrationClosed?: boolean;
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const isConcluded = isEventConcluded(event);

  return (
    <article
      onClick={onClick}
      className={`group cursor-pointer transition-colors duration-150 select-none border-t border-[#E7E5E4] py-6 px-1 hover:bg-[#FFEEDB]/30 md:py-7 md:px-3 md:-mx-3 md:rounded-sm md:hover:bg-[#FFEEDB]/50`}
    >
      {/* ================= DESKTOP VIEW (md:flex, hidden on mobile) ================= */}
      <div className="hidden md:flex md:flex-row md:items-start justify-between gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-headline text-lg md:text-xl font-bold text-ink leading-tight group-hover:text-[#8C3A26] transition-colors">
            {event.name}
          </h3>

          <p className="mt-1.5 text-sm text-ink-muted leading-relaxed max-w-2xl line-clamp-2">
            {event.shortDescription || event.description || 'Details coming soon.'}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-light font-mono">
            <span className="flex items-center gap-1.5 text-[#825E39]">
              <CalendarIcon size={12} className="text-[#825E39]" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <ClockIcon size={12} className="text-ink-muted" />
                {event.time}
              </span>
            )}
            <span className="text-[#268B8C] group-hover:text-[#8C3A26] text-[11px] font-sans font-medium flex items-center gap-0.5 ml-auto sm:ml-0 transition-colors">
              {isConcluded ? 'View archive & photos →' : 'View event details →'}
            </span>
          </div>
        </div>

        {/* Rightmost Middle: Fee Indicator & Status CTA */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="font-mono text-xs tracking-wider uppercase font-semibold">
            {isConcluded ? (
              <span className="text-ink-light/60">Concluded</span>
            ) : event.isFree ? (
              <span className="text-[#268C48]">Free Entry</span>
            ) : (
              <span className="text-[#C2410C] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                Paid Event
              </span>
            )}
          </div>

          {!isConcluded && (
            event.isRegistrationClosed ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] whitespace-nowrap">
                Registration Closed
              </span>
            ) : event.isComingSoon ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] whitespace-nowrap">
                Coming Soon
              </span>
            ) : event.registrationUrl ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  href={event.registrationUrl}
                  external
                  variant="ghost"
                  size="sm"
                  aria-label={`Register for ${event.name}`}
                  className="hover:bg-[#FFF7ED] hover:border-[#C2410C] text-[#C2410C] border-[#FED7AA] text-xs font-medium"
                >
                  Register ↗
                </Button>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* ================= MOBILE VIEW (Minimalistic, open, less suffocated, NO boxes, NO pills, NO dots) ================= */}
      <div className="flex md:hidden flex-col gap-2.5">
        {/* Top Minimal Text Row */}
        <div className="flex items-center justify-between font-mono text-xs tracking-wider uppercase">
          <div>
            {isConcluded ? (
              <span className="text-ink-light/70 text-[11px]">Concluded</span>
            ) : event.isFree ? (
              <span className="text-[#268C48] font-semibold text-[11px]">Free Entry</span>
            ) : (
              <span className="text-[#C2410C] font-semibold text-[11px]">Paid Event</span>
            )}
          </div>

          <div className="text-[11px] font-medium">
            {!isConcluded && (
              event.isRegistrationClosed ? (
                <span className="text-[#B91C1C]">Registration Closed</span>
              ) : event.isComingSoon ? (
                <span className="text-[#92400E]">Coming Soon</span>
              ) : (
                <span className="text-[#166534]">Registration Open</span>
              )
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-headline text-xl font-bold text-ink leading-tight">
          {event.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-ink-muted leading-relaxed">
          {event.shortDescription || event.description || 'Details coming soon.'}
        </p>

        {/* Date, Time & Action Link with generous breathing room */}
        <div className="mt-1 pt-2 flex items-center justify-between text-xs font-mono text-ink-light">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#825E39]">
              <CalendarIcon size={13} className="text-[#825E39]" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5 text-ink-muted">
                <ClockIcon size={13} />
                {event.time}
              </span>
            )}
          </div>

          <span className="text-[#268B8C] group-hover:text-[#8C3A26] font-sans font-medium text-xs">
            {isConcluded ? 'Archive →' : 'Details →'}
          </span>
        </div>
      </div>
    </article>
  );
}

export default EventCard;

