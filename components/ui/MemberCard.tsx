import Image from 'next/image';
import { ExternalLinkIcon } from 'lucide-react';

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
  return (
    <div className="group flex flex-col">
      {/* Avatar */}
      <div className="w-full aspect-square bg-paper-muted rounded-sm overflow-hidden mb-3 relative">
        {member.avatarUrl ? (
          <Image
            src={member.avatarUrl}
            alt={member.name}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-headline text-4xl font-bold text-ink-light select-none">
              {member.name.charAt(0)}
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
          <ExternalLinkIcon size={10} />
        </a>
      )}
    </div>
  );
}
