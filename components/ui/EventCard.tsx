'use client';

import { Badge } from './Atoms';
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
          <div className="flex items-center gap-2 mb-2">
            <Badge
              label={event.isFree ? 'Free' : isConcluded ? 'Archived' : 'Paid'}
              variant={event.isFree ? 'muted' : isConcluded ? 'default' : 'accent'}
            />
          </div>

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

        {/* Right: CTA */}
        {event.registrationUrl && !isConcluded && (
          <div className="shrink-0 self-start sm:self-center" onClick={(e) => e.stopPropagation()}>
            <Button
              href={event.registrationUrl}
              external
              variant="ghost"
              size="sm"
              aria-label={`Register for ${event.name}`}
            >
              Register ↗
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export default EventCard;

