import axios from "axios";

// 1. Create customized axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        secret: process.env.NEXT_PUBLIC_API_SECRET,
        lang: "ar",
    },
});

const withLang = (locale?: string) =>
    locale ? { headers: { lang: locale } } : {};

export type PageKey =
    | "hero_section"
    | "about_us"
    | "ceo"
    | "head_of_marketing"
    | "how_we_work"
    | "footer"
    | "terms_conditions"
    | (string & {});

export type CourseStatus =
    | "in_progress"
    | "overdue"
    | "completed_on_time"
    | "completed_late";

export type MyCoursesParams = {
    title?: string;
    category_code?: string;
    status?: CourseStatus | "";
};

// 2. Centralized Endpoints Configuration
export const endpoints = {
    // Auth
    login: "/auth/login",
    forgotPasswordRequest: "/auth/forgot-password/request",
    forgotPasswordVerify: "/auth/forgot-password/verify",
    forgotPasswordReset: "/auth/forgot-password/reset",

    // Profile
    profile: "/profile",
    profilePassword: "/profile/password",
    profileCourses: "/profile/courses",

    // Courses
    categories: "/categories",

    // Settings
    settings: "/settings",

    // Pages
    pages: "/pages",
    page: (pageKey: PageKey) => `/pages/${pageKey}`,
    hero: "/pages/hero_section",
    about: "/pages/about_us",
    ceo: "/pages/ceo",
    headOfTraining: "/pages/head_of_marketing",
    howWeWork: "/pages/how_we_work",
    footer: "/pages/footer",
    terms: "/pages/terms_conditions",

    // FAQs
    faqs: "/faqs",
};

// 3. Centralized API Fetcher Object
export const api = {
    // Auth
    login: (payload: { email: string; password: string; remember_me?: boolean }, locale?: string) =>
        apiClient.post(endpoints.login, payload, withLang(locale)).then((res) => res.data),
    requestForgotPasswordCode: (payload: { email: string }, locale?: string) =>
        apiClient.post(endpoints.forgotPasswordRequest, payload, withLang(locale)).then((res) => res.data),
    verifyForgotPasswordCode: (payload: { email: string; code: string }, locale?: string) =>
        apiClient.post(endpoints.forgotPasswordVerify, payload, withLang(locale)).then((res) => res.data),
    resetForgotPassword: (
        payload: { email: string; code: string; password: string; password_confirmation: string },
        locale?: string,
    ) => apiClient.post(endpoints.forgotPasswordReset, payload, withLang(locale)).then((res) => res.data),

    // Profile
    getProfile: (locale?: string) =>
        apiClient.get(endpoints.profile, withLang(locale)).then((res) => res.data),
    updateProfile: (payload: Record<string, unknown>, locale?: string) =>
        apiClient.put(endpoints.profile, payload, withLang(locale)).then((res) => res.data),
    changePassword: (
        payload: { current_password: string; password: string; password_confirmation: string },
        locale?: string,
    ) => apiClient.put(endpoints.profilePassword, payload, withLang(locale)).then((res) => res.data),

    // Courses
    getCategories: (locale?: string) =>
        apiClient.get(endpoints.categories, withLang(locale)).then((res) => res.data),
    getMyCourses: (params?: MyCoursesParams, locale?: string) =>
        apiClient.get(endpoints.profileCourses, { ...withLang(locale), params }).then((res) => res.data),

    // Settings
    getSettings: (locale?: string) =>
        apiClient.get(endpoints.settings, withLang(locale)).then((res) => res.data),

    // Pages
    getPages: (cmsOnly = true, locale?: string) =>
        apiClient
            .get(endpoints.pages, { ...withLang(locale), params: cmsOnly ? { cms_only: 1 } : {} })
            .then((res) => res.data),
    getPage: (pageKey: PageKey, locale?: string) =>
        apiClient.get(endpoints.page(pageKey), withLang(locale)).then((res) => res.data),
    getHero: (locale?: string) =>
        apiClient.get(endpoints.hero, withLang(locale)).then((res) => res.data),
    getAbout: (locale?: string) =>
        apiClient.get(endpoints.about, withLang(locale)).then((res) => res.data),
    getCeo: (locale?: string) =>
        apiClient.get(endpoints.ceo, withLang(locale)).then((res) => res.data),
    getHeadOfTraining: (locale?: string) =>
        apiClient.get(endpoints.headOfTraining, withLang(locale)).then((res) => res.data),
    getHowWeWork: (locale?: string) =>
        apiClient.get(endpoints.howWeWork, withLang(locale)).then((res) => res.data),
    getFooter: (locale?: string) =>
        apiClient.get(endpoints.footer, withLang(locale)).then((res) => res.data),
    getTerms: (locale?: string) =>
        apiClient.get(endpoints.terms, withLang(locale)).then((res) => res.data),
    getFaqs: (locale?: string) =>
        apiClient.get(endpoints.faqs, withLang(locale)).then((res) => res.data),
};

export default apiClient;
