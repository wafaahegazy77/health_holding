import { NextRequest, NextResponse } from "next/server";
import {
    forgotPasswordPaths,
    postForgotPassword,
} from "@/lib/auth/forgot-password-server";

type RequestBody = {
    email?: string;
    lang?: string;
};

export async function POST(request: NextRequest) {
    let body: RequestBody;

    try {
        body = (await request.json()) as RequestBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const lang = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";

    if (!email) {
        return NextResponse.json({ message: "Email is required." }, { status: 422 });
    }

    const result = await postForgotPassword(
        forgotPasswordPaths.request,
        { email },
        lang,
    );

    if (!result.ok) {
        return NextResponse.json(
            { message: result.message, errors: result.errors },
            { status: result.status },
        );
    }

    return NextResponse.json({ success: true });
}
