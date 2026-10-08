import { NextRequest, NextResponse } from "next/server";
import { ApiRequestError } from "@/lib/api/server";
import {
    getMyCoursesData,
    type CourseStatus,
    type GetMyCoursesParams,
} from "@/lib/api/profile";

const COURSE_STATUSES: CourseStatus[] = [
    "in_progress",
    "overdue",
    "completed_on_time",
    "completed_late",
];

function isCourseStatus(value: string): value is CourseStatus {
    return COURSE_STATUSES.includes(value as CourseStatus);
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const lang = searchParams.get("lang");
    const locale = lang === "en" || lang === "ar" ? lang : "ar";

    const title = searchParams.get("title")?.trim() || undefined;
    const categoryCode = searchParams.get("category_code")?.trim() || undefined;
    const statusParam = searchParams.get("status")?.trim() || "";
    const status = statusParam && isCourseStatus(statusParam) ? statusParam : undefined;

    const params: GetMyCoursesParams = {
        ...(title ? { title } : {}),
        ...(categoryCode ? { categoryCode } : {}),
        ...(status ? { status } : {}),
    };

    try {
        const data = await getMyCoursesData(params, locale);
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
            { message: "Unable to load courses." },
            { status: 500 },
        );
    }
}
