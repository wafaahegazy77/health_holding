import { NextRequest, NextResponse } from "next/server";
import {
    forgotPasswordPaths,
    postForgotPassword,
} from "@/lib/auth/forgot-password-server";

type ResetBody = {
    email?: string;
    code?: string;
    password?: string;
    passwordConfirmation?: string;
    lang?: string;
};

export async function POST(request: NextRequest) {
    let body: ResetBody;

    try {
        body = (await request.json()) as ResetBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const passwordConfirmation =
        typeof body.passwordConfirmation === "string" ? body.passwordConfirmation : "";
    const lang = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";

    if (!email || !code || !password || !passwordConfirmation) {
        return NextResponse.json(
            { message: "Email, code, password, and confirmation are required." },
            { status: 422 },
        );
    }

    if (!/^\d{4}$/.test(code)) {
        return NextResponse.json(
            { message: "Verification code must be 4 digits." },
            { status: 422 },
        );
    }

    if (password !== passwordConfirmation) {
        return NextResponse.json(
            { message: "Password confirmation does not match." },
            { status: 422 },
        );
    }

    const result = await postForgotPassword(
        forgotPasswordPaths.reset,
        {
            email,
            code,
            password,
            password_confirmation: passwordConfirmation,
        },
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
