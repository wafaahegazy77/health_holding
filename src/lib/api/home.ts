import { api } from "@/lib/api";
import homeAr from "@/mock-api/home.ar.json";
import homeEn from "@/mock-api/home.en.json";

export type HeroSectionData = {
    main_title: string;
    subtitle: string;
    description: string;
};

export type AboutFeature = {
    title: string;
    description: string;
    icon: string;
};

export type AboutSectionData = {
    title: string;
    description: string;
    image_1: string;
    image_2: string;
    features: AboutFeature[];
};

export type CeoSectionData = {
    title: string;
    description: string;
    manager_name: string;
    job_title: string;
    image: string;
};

export async function getHomeData(locale: string) {
    return locale === "ar" ? homeAr : homeEn;
}

export async function getHeroSection(locale: string): Promise<HeroSectionData> {
    try {
        const response = await api.getHero(locale);
        const data = response?.data?.data ?? {};

        return {
            main_title: data.main_title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
        };
    } catch {
        return {
            main_title: "",
            subtitle: "",
            description: "",
        };
    }
}

export async function getAboutSection(locale: string): Promise<AboutSectionData> {
    try {
        const response = await api.getAbout(locale);
        const data = response?.data?.data ?? {};
        const apiFeatures = Array.isArray(data.features)
            ? data.features
            : data.features && typeof data.features === "object"
                ? Object.values(data.features)
                : [];

        return {
            title: data.title || "",
            description: data.description || "",
            image_1: data.image_1 || "",
            image_2: data.image_2 || "",
            features: apiFeatures.map((item: unknown) => {
                const feature = (item ?? {}) as {
                    title?: string;
                    description?: string;
                    icon?: string;
                    name?: string;
                    heading?: string;
                    text?: string;
                    body?: string;
                    image?: string;
                };

                return {
                    title: feature.title || feature.name || feature.heading || "",
                    description: feature.description || feature.text || feature.body || "",
                    icon: feature.icon || feature.image || "",
                };
            }),
        };
    } catch {
        return {
            title: "",
            description: "",
            image_1: "",
            image_2: "",
            features: [],
        };
    }
}

export async function getCeoSection(locale: string): Promise<CeoSectionData> {
    try {
        const response = await api.getCeo(locale);
        const data = response?.data?.data ?? {};

        return {
            title: data.title || "",
            description: data.description || "",
            manager_name: data.manager_name || data.name || "",
            job_title: data.job_title || data.position || "",
            image: data.image || "",
        };
    } catch {
        return {
            title: "",
            description: "",
            manager_name: "",
            job_title: "",
            image: "",
        };
    }
}

export async function getHeadTrainingSection(locale: string): Promise<CeoSectionData> {
    try {
        const response = await api.getHeadOfTraining(locale);
        const data = response?.data?.data ?? {};

        return {
            title: data.title || "",
            description: data.description || "",
            manager_name: data.manager_name || data.name || "",
            job_title: data.job_title || data.position || "",
            image: data.image || "",
        };
    } catch {
        return {
            title: "",
            description: "",
            manager_name: "",
            job_title: "",
            image: "",
        };
    }
}

export type ProcessStep = {
    number: string;
    title: string;
    description: string;
    icon: string;
};

export type ProcessSectionData = {
    title: string;
    description: string;
    items: ProcessStep[];
};

export async function getProcessSection(locale: string): Promise<ProcessSectionData> {
    try {
        const response = await api.getHowWeWork(locale);
        const data = response?.data?.data ?? {};
        const rawItems = Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.steps)
                ? data.steps
                : data.items && typeof data.items === "object"
                    ? Object.values(data.items)
                    : [];

        return {
            title: data.title || "",
            description: data.description || "",
            items: rawItems.map((item: unknown) => {
                const step = (item ?? {}) as {
                    number?: string | number;
                    title?: string;
                    description?: string;
                    icon?: string;
                    image?: string;
                };

                return {
                    number: step.number != null ? String(step.number) : "",
                    title: step.title || "",
                    description: step.description || "",
                    icon: step.icon || step.image || "",
                };
            }),
        };
    } catch {
        return {
            title: "",
            description: "",
            items: [],
        };
    }
}

export type FaqItem = {
    code: string;
    question: string;
    answer: string;
};

export async function getFaqsSection(locale: string): Promise<FaqItem[]> {
    try {
        const response = await api.getFaqs(locale);
        const payload = response?.data;
        const rawItems = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.items)
                    ? payload.items
                    : [];

        return rawItems
            .map((item: unknown) => {
                const faq = (item ?? {}) as {
                    code?: string;
                    question?: string;
                    answer?: string;
                };

                return {
                    code: faq.code || "",
                    question: faq.question || "",
                    answer: faq.answer || "",
                };
            })
            .filter((faq: FaqItem) => faq.question || faq.answer);
    } catch {
        return [];
    }
}

export type FooterSocialKey = "facebook" | "instagram" | "x" | "whatsapp" | "linkedin";

export type FooterSocialLink = {
    key: FooterSocialKey;
    url: string;
};

export type FooterSectionData = {
    description: string;
    email: string;
    phone: string;
    address: string;
    socials: FooterSocialLink[];
};

function toSocialHref(value: string, key: FooterSocialKey) {
    const url = value.trim();
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (key === "whatsapp") {
        const phone = url.replace(/\D/g, "");
        return phone ? `https://wa.me/${phone}` : url;
    }
    return `https://${url.replace(/^\/+/, "")}`;
}

export async function getFooterSection(locale: string): Promise<FooterSectionData> {
    const empty: FooterSectionData = {
        description: "",
        email: "",
        phone: "",
        address: "",
        socials: [],
    };

    try {
        const [footerRes, settingsRes] = await Promise.all([
            api.getFooter(locale).catch(() => null),
            api.getSettings(locale).catch(() => null),
        ]);

        const footerData = footerRes?.data?.data ?? {};
        const settingsPayload = settingsRes?.data;
        const settings =
            settingsPayload?.data &&
            typeof settingsPayload.data === "object" &&
            !Array.isArray(settingsPayload.data)
                ? settingsPayload.data
                : settingsPayload && typeof settingsPayload === "object"
                    ? settingsPayload
                    : {};

        const socialKeys: FooterSocialKey[] = [
            "facebook",
            "instagram",
            "x",
            "whatsapp",
            "linkedin",
        ];

        return {
            description: footerData.description || "",
            email: settings.site_email || settings.email || "",
            phone: settings.site_phone || settings.phone || "",
            address: settings.site_address || settings.address || "",
            socials: socialKeys.flatMap((key) => {
                const value = typeof settings[key] === "string" ? settings[key] : "";
                const url = toSocialHref(value, key);
                return url ? [{ key, url }] : [];
            }),
        };
    } catch {
        return empty;
    }
}