'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  portfolioUrl?: string;
}

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(member.avatarUrl && !imgError);

  return (
    <div className="group flex flex-col">
      {/* Avatar Container */}
      <div className="w-full aspect-square bg-paper-muted rounded-sm overflow-hidden mb-3 relative">
        {hasValidImage ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-paper-dim border border-paper-muted">
            <span className="font-headline text-3xl md:text-4xl font-bold text-ink-light select-none">
              {member.name ? member.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <p className="font-semibold text-sm text-ink leading-tight">{member.name}</p>
      <p className="text-xs text-ink-muted mt-0.5 font-mono tracking-wide">{member.role}</p>

      {/* Portfolio button — only when URL given */}
      {member.portfolioUrl && (
        <a
          href={member.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${member.name}'s portfolio`}
          className="mt-2 inline-flex items-center gap-1 text-xs text-ink-light hover:text-ink transition-colors duration-150 group/link"
        >
          <span className="underline underline-offset-2 group-hover/link:no-underline">Portfolio</span>
          <span aria-hidden="true" className="group-hover/link:translate-x-0.5 transition-transform duration-150">&rarr;</span>
        </a>
      )}
    </div>
  );
}

export default MemberCard;
