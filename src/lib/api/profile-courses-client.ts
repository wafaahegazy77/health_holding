import type {
    Course,
    CourseCategory,
    CourseStatus,
    GetMyCoursesParams,
    MyCoursesData,
} from "@/lib/api/profile";

/** Build dashboard stats from the real courses list (source of truth for UI). */
export function computeCourseStatsFromCourses(courses: Course[]): {
    assigned: number;
    completed: number;
    inProgress: number;
    overdue: number;
    overallCompletion: number | null;
} {
    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    let progressSum = 0;

    for (const course of courses) {
        const status = String(course.status);

        if (status === "completed_on_time" || status === "completed_late") {
            completed += 1;
        } else if (status === "overdue") {
            overdue += 1;
        } else if (status === "in_progress") {
            inProgress += 1;
        }

        // Treat missing progress as 0; completed courses as 100 when progress is absent.
        if (course.progress !== null) {
            progressSum += course.progress;
        } else if (
            status === "completed_on_time" ||
            status === "completed_late"
        ) {
            progressSum += 100;
        }
    }

    const assigned = courses.length;
    const overallCompletion =
        assigned > 0 ? Math.round(progressSum / assigned) : null;

    return {
        assigned,
        completed,
        inProgress,
        overdue,
        overallCompletion,
    };
}

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
