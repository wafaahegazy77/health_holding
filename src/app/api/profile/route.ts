import { NextRequest, NextResponse } from "next/server";
import { ApiRequestError } from "@/lib/api/server";
import {
    updateProfileData,
    type UpdateProfilePayload,
} from "@/lib/api/profile";

type UpdateProfileBody = UpdateProfilePayload & {
    lang?: string;
};

export async function PUT(request: NextRequest) {
    let body: UpdateProfileBody;

    try {
        body = (await request.json()) as UpdateProfileBody;
    } catch {
        return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const locale = body.lang === "en" || body.lang === "ar" ? body.lang : "ar";

    const payload: UpdateProfilePayload = {
        salutation: body.salutation,
        firstName: body.firstName,
        lastName: body.lastName,
        mobile: body.mobile,
        healthcareSector: body.healthcareSector,
        healthcareSectorOther: body.healthcareSectorOther,
        workplaceName: body.workplaceName,
        workplacePostcode: body.workplacePostcode,
    };

    try {
        const profile = await updateProfileData(payload, locale);
        return NextResponse.json({ success: true, data: profile });
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
            { message: "Unable to update profile." },
            { status: 500 },
        );
    }
}
