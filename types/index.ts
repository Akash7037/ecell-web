export interface Member {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  wing?: string;
  featured?: boolean;
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  portfolio?: string;
  contributions: string[];
  year: number;
  quote?: string;
  ecellPerspective?: string;
  currentProject?: string;
  whyEcell?: string;
  keyMetric?: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image: string;
  brochureUrl?: string;
  isActive: boolean;
  isPast: boolean;
  gallery?: string[];
  clips?: string[];
  tag?: string;
  registrationUrl?: string;
  feeType?: 'Free' | 'Paid';
  amountPerTeam?: string;
  time?: string;
}

export interface GalleryItem {
  id: string;
  eventId: string;
  url: string;
  thumbnail: string;
  alt: string;
  type: 'image' | 'video';
}

export interface Brochure {
  id: string;
  eventId: string;
  title: string;
  url: string;
  uploadedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  lastLogin?: string;
  isLocked?: boolean;
  lockUntil?: string;
  failedAttempts: number;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  ipAddress: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  socials: {
    instagram: string;
    linkedin: string;
    github: string;
    twitter: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    card: string;
  };
  typography: {
    display: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}
