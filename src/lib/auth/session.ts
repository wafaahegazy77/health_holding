import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
