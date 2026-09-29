export interface SiteSettings {
  heroDynamicBackground: boolean;
  updatedAt?: string;
}

export const defaultSiteSettings: SiteSettings = {
  heroDynamicBackground: true,
  updatedAt: new Date().toISOString(),
};
