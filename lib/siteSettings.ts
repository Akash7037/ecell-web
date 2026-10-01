export interface SiteSettings {
  heroDynamicBackground: boolean;
  brevoSenderEmail?: string;
  brevoSenderName?: string;
  mottoQuote?: string;
  mottoAuthor?: string;
  mottoRole?: string;
  updatedAt?: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroDynamicBackground: true,
  brevoSenderEmail: process.env.SMTP_FROM_EMAIL || 'ecell.vsbcetc@gmail.com',
  brevoSenderName: process.env.SMTP_FROM_NAME || 'E-Cell VSBCETC',
  mottoQuote:
    'Ideas today, impact tomorrow. We do not wait for permission or polish—we prototype at midnight, test to failure, and build defensible enterprises from engineering hypotheses.',
  mottoAuthor: 'E-Cell Council & Prototyping Sandbox',
  mottoRole: 'VSB College of Engineering & Technical Campus · Coimbatore',
  updatedAt: new Date().toISOString(),
};
