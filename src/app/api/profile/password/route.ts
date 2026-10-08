import { NextRequest, NextResponse } from "next/server";
import { ApiRequestError } from "@/lib/api/server";
import { changeProfilePassword } from "@/lib/api/profile";

type ChangePasswordBody = {
    lang?: string;
    currentPassword?: string;
    password?: string;
    passwordConfirmation?: string;
};

export async function PUT(request: NextRequest) {
    let body: ChangePasswordBody;

    try {
        body = (await request.json()) as ChangePasswordBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const locale = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";
    const currentPassword =
        typeof body.currentPassword === "string" ? body.currentPassword : "";
    const password = typeof body.password === "string" ? body.password : "";
    const passwordConfirmation =
        typeof body.passwordConfirmation === "string"
            ? body.passwordConfirmation
            : "";

    if (!currentPassword || !password || !passwordConfirmation) {
        return NextResponse.json(
            { message: "Current password, password, and confirmation are required." },
            { status: 422 },
        );
    }

    try {
        await changeProfilePassword(
            {
                currentPassword,
                password,
                passwordConfirmation,
            },
            locale,
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ApiRequestError) {
            return NextResponse.json(
                {
                    message: error.message,
                    errors: error.errors,
                },
                { status: error.status },
            );
        }

        return NextResponse.json(
            { message: "Unable to change password." },
            { status: 500 },
        );
    }
}
