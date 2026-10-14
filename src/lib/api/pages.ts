import { api, type PageKey } from "@/lib/api";

export type CmsPageData = {
    title: string;
    contentHtml: string;
};

type PageApiEnvelope = {
    data?: {
        page_key?: string;
        data?: {
            title?: string | null;
            content?: string | null;
            description?: string | null;
            updated_at?: string | null;
            last_updated?: string | null;
        } | null;
    } | null;
};

function asString(value: unknown): string {
    if (value === null || value === undefined) return "";
    return String(value);
}

export async function getCmsPage(
    pageKey: Extract<PageKey, "terms_conditions" | "privacy_policy"> | PageKey,
    locale: string,
): Promise<CmsPageData | null> {
    try {
        const response = (await api.getPage(pageKey, locale)) as PageApiEnvelope;
        const data = response?.data?.data ?? {};

        const title = asString(data.title).trim();
        const contentHtml = asString(
            data.content ?? data.description,
        ).trim();

        if (!title && !contentHtml) return null;

        return {
            title,
            contentHtml,
        };
    } catch {
        return null;
    }
}

export async function getTermsPage(locale: string) {
    return getCmsPage("terms_conditions", locale);
}

export async function getPrivacyPage(locale: string) {
    return getCmsPage("privacy_policy", locale);
}
