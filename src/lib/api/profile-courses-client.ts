import type {
    CourseCategory,
    CourseStatus,
    GetMyCoursesParams,
    MyCoursesData,
} from "@/lib/api/profile";

export type ProfileCoursesFilters = {
    title?: string;
    categoryCode?: string;
    status?: CourseStatus | "";
};

export function getProfileCoursesQueryKey(filters: ProfileCoursesFilters = {}) {
    return [
        "profile",
        "courses",
        {
            title: filters.title ?? "",
            categoryCode: filters.categoryCode ?? "",
            status: filters.status ?? "",
        },
    ] as const;
}

/** @deprecated Use getProfileCoursesQueryKey({}) — kept for Stage 6 call sites if any. */
export const profileCoursesQueryKey = getProfileCoursesQueryKey({});

export const profileCourseCategoriesQueryKey = ["profile", "course-categories"] as const;

function buildCoursesSearchParams(
    locale: string,
    filters: ProfileCoursesFilters = {},
): URLSearchParams {
    const params = new URLSearchParams();
    params.set("lang", locale);

    const title = filters.title?.trim();
    if (title) params.set("title", title);

    const categoryCode = filters.categoryCode?.trim();
    if (categoryCode) params.set("category_code", categoryCode);

    const status = filters.status?.trim();
    if (status) params.set("status", status);

    return params;
}

export async function fetchProfileCourses(
    locale: string,
    filters: ProfileCoursesFilters = {},
): Promise<MyCoursesData> {
    const params = buildCoursesSearchParams(locale, filters);
    const response = await fetch(`/api/profile/courses?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as {
        message?: string;
        errors?: unknown;
        data?: MyCoursesData;
        success?: boolean;
    } | null;

    if (!response.ok) {
        const error = new Error(
            payload?.message || "Unable to load courses.",
        ) as Error & { status?: number; errors?: unknown };
        error.status = response.status;
        error.errors = payload?.errors;
        throw error;
    }

    return (
        payload?.data ?? {
            summary: {},
            continueLearning: null,
            courses: [],
        }
    );
}

export async function fetchCourseCategories(locale: string): Promise<CourseCategory[]> {
    const response = await fetch(
        `/api/categories?lang=${encodeURIComponent(locale)}`,
        {
            headers: { Accept: "application/json" },
            cache: "no-store",
        },
    );

    const payload = (await response.json().catch(() => null)) as {
        message?: string;
        errors?: unknown;
        data?: CourseCategory[];
        success?: boolean;
    } | null;

    if (!response.ok) {
        const error = new Error(
            payload?.message || "Unable to load categories.",
        ) as Error & { status?: number; errors?: unknown };
        error.status = response.status;
        error.errors = payload?.errors;
        throw error;
    }

    return Array.isArray(payload?.data) ? payload.data : [];
}

export type { GetMyCoursesParams };
