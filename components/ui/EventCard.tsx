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
      className={`group border-t border-paper-muted py-6 md:py-7 transition-colors duration-150 hover:bg-[#FFEEDB]/50 px-3 -mx-3 rounded-sm cursor-pointer ${
        onClick ? 'select-none' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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

        {/* Rightmost Middle: Simple Text Fee Indicator & CTA */}
        <div className="shrink-0 self-start sm:self-center flex flex-row sm:flex-col items-center sm:items-end gap-2.5 sm:gap-2">
          {/* Simple text fee label */}
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

          {/* Registration Button, Coming Soon Badge, or Registration Closed Badge */}
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
    </article>
  );
}

export default EventCard;

