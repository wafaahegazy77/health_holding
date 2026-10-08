import { getAuthToken } from "@/lib/auth/session";

export type ApiValidationErrors = Record<string, string[] | string> | string[] | string;

export class ApiRequestError extends Error {
    status: number;
    errors?: ApiValidationErrors;

    constructor(message: string, status: number, errors?: ApiValidationErrors) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.errors = errors;
    }
}

type ServerRequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    locale?: string;
    body?: unknown;
    params?: Record<string, string | number | boolean | null | undefined>;
    /** Default true. Set false for public endpoints (e.g. categories). */
    auth?: boolean;
};

function getApiBaseUrl(): string {
    return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

function getApiSecret(): string | undefined {
    return process.env.API_SECRET || process.env.NEXT_PUBLIC_API_SECRET;
}

function resolveLang(locale?: string): "ar" | "en" {
    return locale === "en" || locale === "ar" ? locale : "ar";
}

function buildUrl(
    path: string,
    params?: ServerRequestOptions["params"],
): string {
    const baseURL = getApiBaseUrl();
    if (!baseURL) {
        throw new ApiRequestError("API is not configured.", 500);
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${baseURL}${normalizedPath}`);

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === "") continue;
            url.searchParams.set(key, String(value));
        }
    }

    return url.toString();
}

function firstValidationError(errors?: ApiValidationErrors): string | undefined {
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

/**
 * Server-only API request helper.
 * When auth is enabled (default), reads the HttpOnly cookie and sends Bearer token.
 * Do not import this module from Client Components.
 */
export async function serverRequest<T = unknown>(
    options: ServerRequestOptions,
): Promise<T> {
    const requireAuth = options.auth !== false;
    const token = requireAuth ? await getAuthToken() : undefined;

    if (requireAuth && !token) {
        throw new ApiRequestError("Unauthorized", 401);
    }

    const secret = getApiSecret();
    const method = options.method ?? "GET";
    const url = buildUrl(options.path, options.params);

    let response: Response;

    try {
        response = await fetch(url, {
            method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(secret ? { secret } : {}),
                lang: resolveLang(options.locale),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body:
                options.body !== undefined && method !== "GET"
                    ? JSON.stringify(options.body)
                    : undefined,
            cache: "no-store",
        });
    } catch {
        throw new ApiRequestError("Unable to reach the API service.", 503);
    }

    let payload: {
        message?: string;
        errors?: ApiValidationErrors;
        data?: unknown;
    } | null = null;

    try {
        payload = (await response.json()) as {
            message?: string;
            errors?: ApiValidationErrors;
            data?: unknown;
        };
    } catch {
        payload = null;
    }

    if (!response.ok) {
        const message =
            firstValidationError(payload?.errors) ||
            (typeof payload?.message === "string" && payload.message.trim()
                ? payload.message
                : `Request failed with status ${response.status}`);

        throw new ApiRequestError(message, response.status, payload?.errors);
    }

    return (payload as T) ?? ({} as T);
}

export async function authenticatedRequest<T = unknown>(
    options: Omit<ServerRequestOptions, "auth">,
): Promise<T> {
    return serverRequest<T>({ ...options, auth: true });
}
