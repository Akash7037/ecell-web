export interface SiteSettings {
  heroDynamicBackground: boolean;
  heroWatermarkEnabled?: boolean;
  heroWatermarkOpacity?: number;
  brevoSenderEmail?: string;
  brevoSenderName?: string;
  mottoQuote?: string;
  mottoAuthor?: string;
  mottoRole?: string;
  updatedAt?: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroDynamicBackground: true,
  heroWatermarkEnabled: true,
  heroWatermarkOpacity: 0.08,
  brevoSenderEmail: process.env.SMTP_FROM_EMAIL || 'ecell.vsbcetc@gmail.com',
  brevoSenderName: process.env.SMTP_FROM_NAME || 'E-Cell VSBCETC',
  mottoQuote:
    'Ideas today, impact tomorrow. Building, prototyping, and empowering student engineers to turn ideas into real-world impact.',
  mottoAuthor: 'E-Cell Council',
  mottoRole: 'VSB College of Engineering & Technical Campus · Coimbatore',
  updatedAt: new Date().toISOString(),
};
