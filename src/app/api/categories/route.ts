import { NextRequest, NextResponse } from "next/server";
import { ApiRequestError } from "@/lib/api/server";
import { getCourseCategories } from "@/lib/api/profile";

export async function GET(request: NextRequest) {
    const lang = request.nextUrl.searchParams.get("lang");
    const locale = lang === "en" || lang === "ar" ? lang : "ar";

    try {
        const data = await getCourseCategories(locale);
        return NextResponse.json({ success: true, data });
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
            { message: "Unable to load categories." },
            { status: 500 },
        );
    }
}
