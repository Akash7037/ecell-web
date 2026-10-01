import { Badge } from './Atoms';
import Button from './Button';
import { CalendarIcon, ClockIcon } from 'lucide-react';

export interface Event {
  id: string;
  name: string;
  shortDescription: string;
  isFree: boolean;
  date: string;      // e.g. "March 15, 2026"
  time: string;      // e.g. "9:00 AM – 5:00 PM"
  registrationUrl?: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group border-t border-paper-muted py-6 md:py-8 transition-colors duration-150 hover:border-ink/20">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge label={event.isFree ? 'Free' : 'Paid'} variant={event.isFree ? 'muted' : 'accent'} />
          </div>
          <h3 className="font-headline text-lg md:text-xl font-bold text-ink leading-tight">
            {event.name}
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted leading-relaxed max-w-xl">
            {event.shortDescription}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-light font-mono">
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={12} />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={12} />
              {event.time}
            </span>
          </div>
        </div>

        {/* Right: CTA */}
        {event.registrationUrl && (
          <div className="shrink-0">
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
