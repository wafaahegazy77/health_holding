import { authenticatedRequest, serverRequest } from "@/lib/api/server";
import { endpoints } from "@/lib/api";

// ---------------------------------------------------------------------------
// Course status (API contract)
// ---------------------------------------------------------------------------

export type CourseStatus =
    | "in_progress"
    | "overdue"
    | "completed_on_time"
    | "completed_late";

export type CourseAction = "start" | "resume" | "review";

// ---------------------------------------------------------------------------
// API types (snake_case / backend shape)
// ---------------------------------------------------------------------------

export type ProfileApiData = {
    salutation?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    mobile?: string | null;
    country?: string | null;
    healthcare_sector?: string | null;
    healthcare_sector_other?: string | null;
    workplace_name?: string | null;
    workplace_postcode?: string | null;
    health_cluster_id?: string | number | null;
    health_cluster?: string | null;
    scfhs_number?: string | null;
    role_statement?: string | null;
    role?: string | null;
    member_since?: string | null;
    created_at?: string | null;
    healthcare_professional?: boolean | null;
    is_healthcare_professional?: boolean | null;
    terms_accepted?: boolean | null;
    marketing_communications?: boolean | null;
};

export type ProfileApiResponse = {
    data?: ProfileApiData;
    message?: string;
    errors?: unknown;
};

export type ProfileUpdateApiBody = {
    salutation?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
    healthcare_sector?: string;
    healthcare_sector_other?: string | null;
    workplace_name?: string;
    workplace_postcode?: string;
};

export type ChangePasswordApiBody = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export type CategoryApiData = {
    code?: string | null;
    title?: string | null;
    image?: string | null;
};

export type CategoriesApiResponse = {
    data?: CategoryApiData[] | Record<string, CategoryApiData>;
    message?: string;
    errors?: unknown;
};

export type CourseApiData = {
    id?: string | number | null;
    code?: string | null;
    title?: string | null;
    cover_image?: string | null;
    status?: string | null;
    action?: string | null;
    url?: string | null;
    category_code?: string | null;
    category_title?: string | null;
    category?: {
        code?: string | null;
        title?: string | null;
    } | null;
};

export type CourseSummaryApiData = {
    total?: number | null;
    in_progress?: number | null;
    overdue?: number | null;
    completed_on_time?: number | null;
    completed_late?: number | null;
};

export type MyCoursesApiData = {
    summary?: CourseSummaryApiData | null;
    continue_learning?: CourseApiData | null;
    courses?: CourseApiData[] | null;
};

export type MyCoursesApiResponse = {
    data?: MyCoursesApiData;
    message?: string;
    errors?: unknown;
};

// ---------------------------------------------------------------------------
// UI / domain types (camelCase)
// ---------------------------------------------------------------------------

export type ProfileData = {
    country: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    memberSince: string;

    roleStatement: string;
    region: string;
    healthcareSector: string;
    healthcareSectorOther: string | null;
    role: string;
    workplace: string;
    postcode: string;
    scfhs: string;
    healthClusterId: string;
    healthCluster: string;

    healthcareProfessional: boolean;
    termsAccepted: boolean;
    marketingCommunications: boolean;
};

/** Editable fields only — used by updateProfileData. */
export type UpdateProfilePayload = {
    salutation?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    healthcareSector?: string;
    healthcareSectorOther?: string | null;
    workplaceName?: string;
    workplacePostcode?: string;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
};

export type CourseCategory = {
    code: string;
    title: string;
    image: string | null;
};

export type CourseSummary = {
    total?: number;
    inProgress?: number;
    overdue?: number;
    completedOnTime?: number;
    completedLate?: number;
};

export type Course = {
    id: string | number;
    code: string;
    title: string;
    coverImage: string | null;
    status: CourseStatus | string;
    action: CourseAction | string | null;
    url: string | null;
    categoryCode: string;
    categoryTitle: string;
};

export type MyCoursesData = {
    summary: CourseSummary;
    continueLearning: Course | null;
    courses: Course[];
};

export type GetMyCoursesParams = {
    title?: string;
    categoryCode?: string;
    status?: CourseStatus | "";
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function asString(value: unknown, fallback = ""): string {
    if (value === null || value === undefined) return fallback;
    return String(value);
}

function asNullableString(value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;
    return String(value);
}

function asBoolean(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") return value;
    return fallback;
}

function asNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        return Number(value);
    }
    return undefined;
}

function unwrapData<T>(payload: { data?: T } | T): T {
    if (
        payload &&
        typeof payload === "object" &&
        "data" in payload &&
        (payload as { data?: T }).data !== undefined
    ) {
        return (payload as { data: T }).data;
    }

    return payload as T;
}

function isCourseStatus(value: string): value is CourseStatus {
    return (
        value === "in_progress" ||
        value === "overdue" ||
        value === "completed_on_time" ||
        value === "completed_late"
    );
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function mapProfileResponseToProfileData(
    apiData: ProfileApiData | null | undefined,
): ProfileData {
    const data = apiData ?? {};

    return {
        country: asString(data.country),
        salutation: asString(data.salutation),
        firstName: asString(data.first_name),
        lastName: asString(data.last_name),
        email: asString(data.email),
        mobile: asString(data.mobile),
        memberSince: asString(data.member_since ?? data.created_at),

        roleStatement: asString(data.role_statement),
        region: asString(data.health_cluster),
        healthcareSector: asString(data.healthcare_sector),
        healthcareSectorOther: asNullableString(data.healthcare_sector_other),
        role: asString(data.role),
        workplace: asString(data.workplace_name),
        postcode: asString(data.workplace_postcode),
        scfhs: asString(data.scfhs_number),
        healthClusterId: asString(data.health_cluster_id),
        healthCluster: asString(data.health_cluster),

        healthcareProfessional: asBoolean(
            data.healthcare_professional ?? data.is_healthcare_professional,
        ),
        termsAccepted: asBoolean(data.terms_accepted),
        marketingCommunications: asBoolean(data.marketing_communications),
    };
}

/**
 * Maps UI camelCase editable fields → API snake_case body.
 * Never includes locked fields (email, health_cluster*, scfhs_number).
 */
export function mapProfileToUpdatePayload(
    payload: UpdateProfilePayload,
): ProfileUpdateApiBody {
    const body: ProfileUpdateApiBody = {};

    if (payload.salutation !== undefined) body.salutation = payload.salutation;
    if (payload.firstName !== undefined) body.first_name = payload.firstName;
    if (payload.lastName !== undefined) body.last_name = payload.lastName;
    if (payload.mobile !== undefined) body.mobile = payload.mobile;
    if (payload.healthcareSector !== undefined) {
        body.healthcare_sector = payload.healthcareSector;
    }
    if (payload.healthcareSectorOther !== undefined) {
        body.healthcare_sector_other = payload.healthcareSectorOther;
    }
    if (payload.workplaceName !== undefined) {
        body.workplace_name = payload.workplaceName;
    }
    if (payload.workplacePostcode !== undefined) {
        body.workplace_postcode = payload.workplacePostcode;
    }

    return body;
}

/** Convenience: build update payload from full ProfileData UI shape. */
export function mapProfileDataToUpdatePayload(data: ProfileData): ProfileUpdateApiBody {
    return mapProfileToUpdatePayload({
        salutation: data.salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        healthcareSector: data.healthcareSector,
        healthcareSectorOther: data.healthcareSectorOther,
        workplaceName: data.workplace,
        workplacePostcode: data.postcode,
    });
}

export function mapChangePasswordPayload(
    payload: ChangePasswordPayload,
): ChangePasswordApiBody {
    return {
        current_password: payload.currentPassword,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
    };
}

export function mapCourseResponseToCourse(
    apiCourse: CourseApiData | null | undefined,
): Course | null {
    if (!apiCourse || typeof apiCourse !== "object") return null;

    const statusRaw = asString(apiCourse.status);
    const actionRaw = asNullableString(apiCourse.action);
    const id = apiCourse.id ?? apiCourse.code ?? "";

    return {
        id,
        code: asString(apiCourse.code),
        title: asString(apiCourse.title),
        coverImage: asNullableString(apiCourse.cover_image),
        status: isCourseStatus(statusRaw) ? statusRaw : statusRaw,
        action: actionRaw,
        url: asNullableString(apiCourse.url),
        categoryCode: asString(
            apiCourse.category_code ?? apiCourse.category?.code,
        ),
        categoryTitle: asString(
            apiCourse.category_title ?? apiCourse.category?.title,
        ),
    };
}

export function mapCourseSummaryResponseToCourseSummary(
    apiSummary: CourseSummaryApiData | null | undefined,
): CourseSummary {
    const summary = apiSummary ?? {};

    return {
        total: asNumber(summary.total),
        inProgress: asNumber(summary.in_progress),
        overdue: asNumber(summary.overdue),
        completedOnTime: asNumber(summary.completed_on_time),
        completedLate: asNumber(summary.completed_late),
    };
}

export function mapCategoryResponseToCourseCategory(
    apiCategory: CategoryApiData | null | undefined,
): CourseCategory | null {
    if (!apiCategory || typeof apiCategory !== "object") return null;

    const code = asString(apiCategory.code);
    if (!code) return null;

    return {
        code,
        title: asString(apiCategory.title),
        image: asNullableString(apiCategory.image),
    };
}

function mapCategoriesList(data: unknown): CourseCategory[] {
    const list = Array.isArray(data)
        ? data
        : data && typeof data === "object"
          ? Object.values(data as Record<string, CategoryApiData>)
          : [];

    return list
        .map((item) => mapCategoryResponseToCourseCategory(item as CategoryApiData))
        .filter((item): item is CourseCategory => item !== null);
}

function mapMyCoursesApiData(apiData: MyCoursesApiData | null | undefined): MyCoursesData {
    const data = apiData ?? {};
    const courses = Array.isArray(data.courses) ? data.courses : [];

    return {
        summary: mapCourseSummaryResponseToCourseSummary(data.summary),
        continueLearning: mapCourseResponseToCourse(data.continue_learning),
        courses: courses
            .map((course) => mapCourseResponseToCourse(course))
            .filter((course): course is Course => course !== null),
    };
}

// ---------------------------------------------------------------------------
// API functions (server-only — use from Server Components / Route Handlers)
// ---------------------------------------------------------------------------

export async function getProfileData(locale: string = "ar"): Promise<ProfileData> {
    const response = await authenticatedRequest<ProfileApiResponse>({
        method: "GET",
        path: endpoints.profile,
        locale,
    });

    return mapProfileResponseToProfileData(unwrapData<ProfileApiData>(response));
}

export async function updateProfileData(
    payload: UpdateProfilePayload,
    locale: string = "ar",
): Promise<ProfileData> {
    const response = await authenticatedRequest<ProfileApiResponse>({
        method: "PUT",
        path: endpoints.profile,
        locale,
        body: mapProfileToUpdatePayload(payload),
    });

    return mapProfileResponseToProfileData(unwrapData<ProfileApiData>(response));
}

export async function changeProfilePassword(
    payload: ChangePasswordPayload,
    locale: string = "ar",
): Promise<void> {
    await authenticatedRequest({
        method: "PUT",
        path: endpoints.profilePassword,
        locale,
        body: mapChangePasswordPayload(payload),
    });
}

export async function getMyCoursesData(
    params: GetMyCoursesParams = {},
    locale: string = "ar",
): Promise<MyCoursesData> {
    const response = await authenticatedRequest<MyCoursesApiResponse>({
        method: "GET",
        path: endpoints.profileCourses,
        locale,
        params: {
            title: params.title,
            category_code: params.categoryCode,
            status: params.status,
        },
    });

    return mapMyCoursesApiData(unwrapData<MyCoursesApiData>(response));
}

export async function getCourseCategories(
    locale: string = "ar",
): Promise<CourseCategory[]> {
    const response = await serverRequest<CategoriesApiResponse>({
        method: "GET",
        path: endpoints.categories,
        locale,
        auth: false,
    });

    return mapCategoriesList(unwrapData(response));
}
