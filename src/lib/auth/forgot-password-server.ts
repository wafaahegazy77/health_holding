import { endpoints } from "@/lib/api";

export type AuthErrorBody = {
    message?: string;
    errors?: Record<string, string[] | string> | string[] | string;
};

export function firstValidationError(
    errors?: AuthErrorBody["errors"],
): string | undefined {
    if (!errors) return undefined;

    if (typeof errors === "string") {
        return errors.trim() || undefined;
    }

    if (Array.isArray(errors)) {
        const first = errors.find((item) => typeof item === "string" && item.trim());
        return first ? String(first) : undefined;
    }

    if (typeof errors !== "object") return undefined;

    for (const value of Object.values(errors)) {
        if (Array.isArray(value) && value[0]) return String(value[0]);
        if (typeof value === "string" && value.trim()) return value;
    }

    return undefined;
}

function getApiBaseUrl(): string {
    return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function getApiSecret(): string | undefined {
    return process.env.API_SECRET || process.env.NEXT_PUBLIC_API_SECRET;
}

export async function postForgotPassword(
    path: string,
    body: Record<string, unknown>,
    locale: string,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; message: string; errors?: AuthErrorBody["errors"] }> {
    const baseURL = getApiBaseUrl();
    const secret = getApiSecret();
    const lang = locale === "en" || locale === "ar" ? locale : "ar";

    if (!baseURL) {
        return { ok: false, status: 500, message: "API is not configured." };
    }

    let response: Response;

    try {
        response = await fetch(`${baseURL}${path.startsWith("/") ? path : `/${path}`}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(secret ? { secret } : {}),
                lang,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });
    } catch {
        return {
            ok: false,
            status: 503,
            message: "Unable to reach the authentication service.",
        };
    }

    let payload: AuthErrorBody | null = null;

    try {
        payload = (await response.json()) as AuthErrorBody;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            message:
                firstValidationError(payload?.errors) ||
                (typeof payload?.message === "string" && payload.message.trim()
                    ? payload.message
                    : `Request failed with status ${response.status}`),
            errors: payload?.errors,
        };
    }

    return { ok: true, data: payload };
}

export const forgotPasswordPaths = {
    request: endpoints.forgotPasswordRequest,
    verify: endpoints.forgotPasswordVerify,
    reset: endpoints.forgotPasswordReset,
} as const;
