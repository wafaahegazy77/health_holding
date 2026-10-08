export const AUTH_COOKIE_NAME = "api_token";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getAuthCookieOptions(rememberMe: boolean) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        ...(rememberMe ? { maxAge: REMEMBER_ME_MAX_AGE } : {}),
    };
}
