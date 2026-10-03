'use client';

import { useState, useEffect } from 'react';
import { XIcon, CalendarIcon, ClockIcon, MapPinIcon, ExternalLinkIcon, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Atoms';
import Button from '@/components/ui/Button';
import { isEventConcluded } from '@/lib/eventUtils';

export interface EventModalData {
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

interface EventModalProps {
  event: EventModalData | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else {
          onClose();
        }
      }
    };
    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, selectedPhoto, onClose]);

  if (!event) return null;

  const isConcluded = isEventConcluded(event);
  // Only actual event gallery photos (separate from header cover banner)
  const galleryPhotos = (event.gallery || []).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-paper border border-paper-muted rounded-sm shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner (if available) */}
        {event.imageUrl ? (
          <div className="relative w-full h-56 sm:h-72 bg-paper-muted overflow-hidden shrink-0">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-black/30" />
            
            {/* Close Button Top Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-ink/60 hover:bg-ink text-white transition-colors"
              aria-label="Close modal"
            >
              <XIcon size={18} />
            </button>

            {/* Badge overlay bottom left */}
            <div className="absolute bottom-4 left-6">
              <Badge
                label={!isConcluded && event.isRegistrationClosed ? 'Registration Closed' : !isConcluded && event.isComingSoon ? 'Coming Soon' : event.isFree ? 'Free Entry' : isConcluded ? 'Archived Event' : 'Paid Event'}
                variant={!isConcluded && (event.isRegistrationClosed || event.isComingSoon) ? 'accent' : event.isFree ? 'muted' : 'accent'}
              />
            </div>
          </div>
        ) : (
          <div className="p-6 pb-0 flex items-center justify-between border-b border-paper-muted">
            <Badge
              label={!isConcluded && event.isRegistrationClosed ? 'Registration Closed' : !isConcluded && event.isComingSoon ? 'Coming Soon' : event.isFree ? 'Free Entry' : isConcluded ? 'Archived Event' : 'Paid Event'}
              variant={!isConcluded && (event.isRegistrationClosed || event.isComingSoon) ? 'accent' : event.isFree ? 'muted' : 'accent'}
            />
            <button
              onClick={onClose}
              className="p-1.5 text-ink-muted hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              <XIcon size={20} />
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-light mb-1.5">
              E-Cell VSBCETC &bull; Coimbatore
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-ink leading-tight">
              {event.name}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-muted leading-relaxed">
              {event.description || event.shortDescription}
            </p>
          </div>

          {/* Meta Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-paper-dim border border-paper-muted rounded-sm">
            <div className="flex items-start gap-2.5">
              <CalendarIcon size={16} className="text-vermilion shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] uppercase text-ink-light tracking-wider">Date</span>
                <span className="text-xs font-semibold text-ink">{event.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ClockIcon size={16} className="text-vermilion shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] uppercase text-ink-light tracking-wider">Time</span>
                <span className="text-xs font-semibold text-ink">{event.time || 'TBA'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPinIcon size={16} className="text-vermilion shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] uppercase text-ink-light tracking-wider">Venue</span>
                <span className="text-xs font-semibold text-ink leading-snug">
                  {event.location || 'VSBCETC Coimbatore'}
                </span>
              </div>
            </div>
          </div>

          {/* Event Photo Gallery — Only displayed for past / concluded events with actual archive photos */}
          {isConcluded && galleryPhotos.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={15} className="text-ink" />
                <h3 className="font-headline text-sm font-bold text-ink uppercase tracking-wider">
                  Event Archive & Gallery ({galleryPhotos.length})
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryPhotos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(photoUrl)}
                    className="group aspect-video rounded-sm overflow-hidden bg-paper-muted border border-paper-muted cursor-pointer relative"
                  >
                    <img
                      src={photoUrl}
                      alt={`${event.name} photo ${idx + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 font-mono text-[10px] bg-ink/80 text-white px-2 py-0.5 rounded-sm transition-opacity">
                        Enlarge
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-paper-muted flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isConcluded && event.isRegistrationClosed ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-mono font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
                Registration Closed
              </span>
            ) : !isConcluded && event.isComingSoon ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-mono font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Registration Coming Soon
              </span>
            ) : event.registrationUrl && !isConcluded ? (
              <Button href={event.registrationUrl} external size="md">
                Register for Event <ExternalLinkIcon size={14} className="ml-1.5" />
              </Button>
            ) : (
              <span className="text-xs font-mono text-ink-light">
                {isConcluded ? 'This event has concluded. Prototype archives are on campus.' : 'Registration opens on official date announcement.'}
              </span>
            )}
            <button
              onClick={onClose}
              className="text-xs text-ink-muted hover:text-ink transition-colors font-mono"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom View */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={selectedPhoto}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white p-2 hover:text-vermilion font-mono text-xs flex items-center gap-1"
            >
              <XIcon size={16} /> Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventModal;
