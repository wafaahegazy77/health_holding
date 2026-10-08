import { NextRequest, NextResponse } from "next/server";
import {
    forgotPasswordPaths,
    postForgotPassword,
} from "@/lib/auth/forgot-password-server";

type VerifyBody = {
    email?: string;
    code?: string;
    lang?: string;
};

export async function POST(request: NextRequest) {
    let body: VerifyBody;

    try {
        body = (await request.json()) as VerifyBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const lang = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";

    if (!email || !code) {
        return NextResponse.json(
            { message: "Email and verification code are required." },
            { status: 422 },
        );
    }

    if (!/^\d{4}$/.test(code)) {
        return NextResponse.json(
            { message: "Verification code must be 4 digits." },
            { status: 422 },
        );
    }

    const result = await postForgotPassword(
        forgotPasswordPaths.verify,
        { email, code },
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
