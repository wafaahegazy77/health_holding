"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Course, CourseStatus } from "@/lib/api/profile";
import {
    computeCourseStatsFromCourses,
    fetchCourseCategories,
    fetchProfileCourses,
    getProfileCoursesQueryKey,
    profileCourseCategoriesQueryKey,
} from "@/lib/api/profile-courses-client";

import ProfileCourseCard from "./ProfileCourseCard";

import "@/components/home/CourseCard/_CourseCard.scss";
import "./_MyCourses.scss";

const COURSE_STATUSES: CourseStatus[] = [
    "in_progress",
    "overdue",
    "completed_on_time",
    "completed_late",
];

function actionLabelKey(action: Course["action"]): "start" | "resume" | "review" {
    if (action === "start" || action === "resume" || action === "review") {
        return action;
    }

    return "resume";
}

type MyCoursesProps = {
    locale?: string;
};

const MyCourses = ({ locale }: MyCoursesProps) => {
    const t = useTranslations("profile.courses");
    const currentLocale = useLocale();
    const resolvedLocale =
        locale === "en" || locale === "ar" ? locale : currentLocale;

    const [titleInput, setTitleInput] = useState("");
    const [title, setTitle] = useState("");
    const [categoryCode, setCategoryCode] = useState("");
    const [status, setStatus] = useState<CourseStatus | "">("");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setTitle(titleInput.trim());
        }, 350);

        return () => window.clearTimeout(timer);
    }, [titleInput]);

    const filters = useMemo(
        () => ({
            title,
            categoryCode,
            status,
        }),
        [title, categoryCode, status],
    );

    const {
        data: categories = [],
        isPending: isCategoriesPending,
        isError: isCategoriesError,
        error: categoriesError,
    } = useQuery({
        queryKey: profileCourseCategoriesQueryKey,
        queryFn: () => fetchCourseCategories(resolvedLocale),
    });

    const hasActiveFilters = Boolean(
        title || categoryCode || status,
    );

    const { data, isPending, isError, error, isFetching } = useQuery({
        queryKey: getProfileCoursesQueryKey(filters),
        queryFn: () => fetchProfileCourses(resolvedLocale, filters),
        placeholderData: keepPreviousData,
    });

    // Unfiltered list — keeps stats aligned with all assigned courses.
    const { data: statsSource, isPending: isStatsPending } = useQuery({
        queryKey: getProfileCoursesQueryKey({}),
        queryFn: () => fetchProfileCourses(resolvedLocale, {}),
        enabled: hasActiveFilters,
    });

    const courses = data?.courses ?? [];
    const continueLearning =
        data?.continueLearning ?? statsSource?.continueLearning ?? null;

    const statsCourses = hasActiveFilters
        ? (statsSource?.courses ?? [])
        : courses;
    const summary = (hasActiveFilters ? statsSource?.summary : data?.summary) ?? {};
    const computedStats = computeCourseStatsFromCourses(statsCourses);

    const useComputedStats = statsCourses.length > 0;
    const assignedCount = useComputedStats
        ? computedStats.assigned
        : (summary.total ?? 0);
    const completedCount = useComputedStats
        ? computedStats.completed
        : (summary.completedOnTime ?? 0) + (summary.completedLate ?? 0);
    const inProgressCount = useComputedStats
        ? computedStats.inProgress
        : (summary.inProgress ?? 0);
    const overdueCount = useComputedStats
        ? computedStats.overdue
        : (summary.overdue ?? 0);
    const overallCompletion = useComputedStats
        ? computedStats.overallCompletion
        : (summary.overallCompletion ?? null);

    const continueProgress = continueLearning?.progress ?? null;
    const continueCompletedModules =
        continueLearning?.completedModules ?? null;
    const continueModulesCount = continueLearning?.modulesCount ?? null;
    const continueHasModules =
        continueCompletedModules !== null && continueModulesCount !== null;
    const continueHasProgress = continueProgress !== null;
    const continueProgressLabel = [
        continueHasModules
            ? `${continueCompletedModules}/${continueModulesCount} ${t("modulesDone")}`
            : null,
        continueHasProgress ? `${continueProgress}%` : null,
    ]
        .filter(Boolean)
        .join(" — ");

    const showInitialLoading = isPending && !data;
    const showStatsLoading =
        showInitialLoading ||
        (hasActiveFilters && isStatsPending && !statsSource);

    return (
        <div className="my_courses">

            {/* Courses Statistics */}
            <div className="courses_stats">

                <div className="course_stat_card">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-book-open"></i>
                    </div>
                    <strong>
                        {showStatsLoading ? "—" : assignedCount}
                    </strong>
                    <span>
                        {t("stats.assigned")}
                    </span>
                </div>

                <div className="course_stat_card course_stat_completed">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-check"></i>
                    </div>
                    <strong>
                        {showStatsLoading ? "—" : completedCount}
                    </strong>
                    <span>
                        {t("stats.completed")}
                    </span>
                </div>

                <div className="course_stat_card course_stat_in_progress">
                    <div className="course_stat_icon">
                        <i className="fa-solid fa-play"></i>
                    </div>
                    <strong>
                        {showStatsLoading ? "—" : inProgressCount}
                    </strong>
                    <span>
                        {t("stats.inProgress")}
                    </span>
                </div>

                <div className="course_stat_card course_stat_not_started">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-minus"></i>
                    </div>
                    <strong>
                        {showStatsLoading ? "—" : overdueCount}
                    </strong>
                    <span>
                        {t("stats.overdue")}
                    </span>
                </div>

                <div className="course_stat_card course_stat_completion">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-chart-simple"></i>
                    </div>
                    <strong>
                        {showStatsLoading || overallCompletion === null
                            ? "—"
                            : `${overallCompletion}%`}
                    </strong>
                    <span>
                        {t("stats.overallCompletion")}
                    </span>
                </div>

            </div>

            {/* Resume / Continue Learning */}
            {!showInitialLoading && continueLearning ? (
                <div className="resume_course">

                    <div className="resume_course_content">
                        <span className="resume_course_eyebrow">
                            {t("resume.pickUp")}
                        </span>

                        <h3>
                            {continueLearning.title}
                        </h3>

                        {continueHasModules || continueHasProgress ? (
                            <div className="resume_progress">
                                <div className="resume_progress_bar">
                                    <span
                                        className="resume_progress_fill"
                                        style={{
                                            width: `${continueProgress ?? 0}%`,
                                        }}
                                    ></span>
                                </div>
                                <span>
                                    {continueProgressLabel}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {continueLearning.url ? (
                        <a
                            href={continueLearning.url}
                            className="resume_course_button"
                        >
                            <i className="fa-solid fa-play"></i>
                            <span>
                                {t(
                                    `actions.${actionLabelKey(continueLearning.action)}`,
                                )}
                            </span>
                        </a>
                    ) : (
                        <button
                            type="button"
                            className="resume_course_button"
                            disabled
                        >
                            <i className="fa-solid fa-play"></i>
                            <span>
                                {t(
                                    `actions.${actionLabelKey(continueLearning.action)}`,
                                )}
                            </span>
                        </button>
                    )}

                </div>
            ) : null}

            {/* Search & Filters */}
            <div className="courses_filters">

                <div className="courses_search">
                    <i className="fa-regular fa-magnifying-glass"></i>
                    <input
                        type="search"
                        placeholder={t("filters.search")}
                        value={titleInput}
                        onChange={(event) => setTitleInput(event.target.value)}
                    />
                </div>

                <div className="courses_filter">
                    <select
                        value={categoryCode}
                        onChange={(event) => setCategoryCode(event.target.value)}
                        disabled={isCategoriesPending}
                    >
                        <option value="">
                            {isCategoriesPending
                                ? t("loadingCategories")
                                : t("filters.allCategories")}
                        </option>

                        {categories.map((category) => (
                            <option
                                value={category.code}
                                key={category.code}
                            >
                                {category.title}
                            </option>
                        ))}
                    </select>
                    <i className="fa-regular fa-chevron-down"></i>
                </div>

                <div className="courses_filter">
                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                (event.target.value || "") as CourseStatus | "",
                            )
                        }
                    >
                        <option value="">
                            {t("filters.allStatuses")}
                        </option>

                        {COURSE_STATUSES.map((value) => (
                            <option
                                value={value}
                                key={value}
                            >
                                {t(`status.${value}`)}
                            </option>
                        ))}
                    </select>
                    <i className="fa-regular fa-chevron-down"></i>
                </div>

            </div>

            {isCategoriesError ? (
                <p
                    className="text-danger mb-3"
                    role="alert"
                    style={{ fontSize: 14 }}
                >
                    {categoriesError instanceof Error &&
                    categoriesError.message
                        ? categoriesError.message
                        : t("categoriesError")}
                </p>
            ) : null}

            {/* Courses */}
            {showInitialLoading ? (
                <p
                    className="mb-0"
                    style={{ fontSize: 14 }}
                >
                    {t("loading")}
                </p>
            ) : null}

            {!showInitialLoading && isError ? (
                <p
                    className="text-danger mb-0"
                    role="alert"
                    style={{ fontSize: 14 }}
                >
                    {error instanceof Error && error.message
                        ? error.message
                        : t("error")}
                </p>
            ) : null}

            {!showInitialLoading && !isError && courses.length === 0 ? (
                <p
                    className="mb-0"
                    style={{ fontSize: 14 }}
                >
                    {t("empty")}
                </p>
            ) : null}

            {!showInitialLoading && !isError && courses.length > 0 ? (
                <div
                    className="row gx-3"
                    style={isFetching ? { opacity: 0.72 } : undefined}
                >
                    {courses.map((course) => (
                        <div
                            className="col-lg-4"
                            key={`${course.id}-${course.code}`}
                        >
                            <ProfileCourseCard
                                course={course}
                                categories={categories}
                            />
                        </div>
                    ))}
                </div>
            ) : null}

        </div>
    );
};

export default MyCourses;
