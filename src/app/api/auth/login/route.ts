import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from "@/lib/auth/cookies";

type LoginBody = {
    email?: string;
    password?: string;
    remember_me?: boolean;
    lang?: string;
};

type BackendErrorBody = {
    message?: string;
    errors?: Record<string, string[] | string> | string[] | string;
};

function firstValidationError(
    errors?: Record<string, string[] | string> | string[] | string,
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

export async function POST(request: NextRequest) {
    let body: LoginBody;

    try {
        body = (await request.json()) as LoginBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rememberMe = Boolean(body.remember_me);
    const lang = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";

    if (!email || !password) {
        return NextResponse.json(
            { message: "Email and password are required." },
            { status: 422 },
        );
    }

    const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const secret = process.env.API_SECRET || process.env.NEXT_PUBLIC_API_SECRET;

    if (!baseURL) {
        return NextResponse.json(
            { message: "API is not configured." },
            { status: 500 },
        );
    }

    try {
        const backendResponse = await fetch(`${baseURL.replace(/\/$/, "")}/auth/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(secret ? { secret } : {}),
                lang,
            },
            body: JSON.stringify({
                email,
                password,
                remember_me: rememberMe,
            }),
            cache: "no-store",
        });

        let data: (BackendErrorBody & { data?: { api_token?: string } }) | null = null;

        try {
            data = (await backendResponse.json()) as BackendErrorBody & {
                data?: { api_token?: string };
            };
        } catch {
            data = null;
        }

        if (!backendResponse.ok) {
            const message =
                firstValidationError(data?.errors) ||
                data?.message ||
                "Unable to sign in.";

            return NextResponse.json(
                {
                    message,
                    errors: data?.errors,
                },
                { status: backendResponse.status },
            );
        }

        const token = data?.data?.api_token;

        if (!token || typeof token !== "string") {
            return NextResponse.json(
                { message: "Authentication token is missing from the response." },
                { status: 502 },
            );
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions(rememberMe));
        return response;
    } catch {
        return NextResponse.json(
            { message: "Unable to reach the authentication service." },
            { status: 503 },
        );
    }
}
