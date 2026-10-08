import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

const intlMiddleware = createMiddleware(routing);

function getLocaleFromPathname(pathname: string): string {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (
        firstSegment &&
        (routing.locales as readonly string[]).includes(firstSegment)
    ) {
        return firstSegment;
    }
    return routing.defaultLocale;
}

function isProtectedPath(pathname: string): boolean {
    const normalized = pathname.replace(/\/+$/, "") || "/";
    const parts = normalized.split("/").filter(Boolean);
    const hasLocale = (routing.locales as readonly string[]).includes(parts[0] ?? "");
    const routeParts = hasLocale ? parts.slice(1) : parts;
    return routeParts[0] === "profile";
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isProtectedPath(pathname)) {
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            const locale = getLocaleFromPathname(pathname);
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = `/${locale}/login`;
            loginUrl.search = "";
            return NextResponse.redirect(loginUrl);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
