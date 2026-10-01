export interface SiteSettings {
  heroDynamicBackground: boolean;
  brevoSenderEmail?: string;
  brevoSenderName?: string;
  updatedAt?: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroDynamicBackground: true,
  brevoSenderEmail: process.env.SMTP_FROM_EMAIL || '',
  brevoSenderName: process.env.SMTP_FROM_NAME || 'E-Cell VSBCETC',
  updatedAt: new Date().toISOString(),
};
