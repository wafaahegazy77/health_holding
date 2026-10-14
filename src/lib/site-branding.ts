export const DEFAULT_SITE_LOGO = "/images/logo.png";
export const DEFAULT_SITE_FAVICON = "/images/icon.png";

export type SiteSettingsData = {
    logo: string;
    favicon: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    x: string;
    whatsapp: string;
    linkedin: string;
    youtube: string;
};

export const emptySiteSettings = (): SiteSettingsData => ({
    logo: DEFAULT_SITE_LOGO,
    favicon: DEFAULT_SITE_FAVICON,
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    x: "",
    whatsapp: "",
    linkedin: "",
    youtube: "",
});
