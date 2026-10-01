'use client';

import Button from './Button';
import { CalendarIcon, ClockIcon } from 'lucide-react';

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
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const isConcluded =
    (event.date || '').toLowerCase().includes('completed') ||
    (event.date || '').toLowerCase().includes('archive') ||
    (event.shortDescription || '').toLowerCase().includes('concluded');

  return (
    <article
      onClick={onClick}
      className={`group border-t border-paper-muted py-6 md:py-7 transition-colors duration-150 hover:bg-paper-muted/30 cursor-pointer ${
        onClick ? 'select-none' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-headline text-lg md:text-xl font-bold text-ink leading-tight group-hover:text-vermilion transition-colors">
            {event.name}
          </h3>

          <p className="mt-1.5 text-sm text-ink-muted leading-relaxed max-w-2xl line-clamp-2">
            {event.shortDescription}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-light font-mono">
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={12} className="text-ink-muted" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <ClockIcon size={12} className="text-ink-muted" />
                {event.time}
              </span>
            )}
            <span className="text-vermilion/80 group-hover:text-vermilion text-[11px] font-sans font-medium flex items-center gap-0.5 ml-auto sm:ml-0">
              View details & photos &rarr;
            </span>
          </div>
        </div>

        {/* Rightmost Middle: Simple Text Fee Indicator & CTA */}
        <div className="shrink-0 self-start sm:self-center flex flex-row sm:flex-col items-center sm:items-end gap-2.5 sm:gap-2">
          {/* Simple text fee label (replaces boxed badge) */}
          <div className="font-mono text-xs tracking-wider uppercase">
            {isConcluded ? (
              <span className="text-ink-light/60">Concluded</span>
            ) : event.isFree ? (
              <span className="text-ink-muted">Free Entry</span>
            ) : (
              <span className="text-vermilion font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                Paid Event
              </span>
            )}
          </div>

          {/* Registration Button */}
          {event.registrationUrl && !isConcluded && (
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                href={event.registrationUrl}
                external
                variant="ghost"
                size="sm"
                aria-label={`Register for ${event.name}`}
                className="hover:bg-[#EDE8D0]/60 text-xs"
              >
                Register ↗
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default EventCard;

