"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Course, CourseAction, CourseStatus } from "@/lib/api/profile";
import {
    fetchCourseCategories,
    fetchProfileCourses,
    getProfileCoursesQueryKey,
    profileCourseCategoriesQueryKey,
} from "@/lib/api/profile-courses-client";

import "@/components/home/CourseCard/_CourseCard.scss";
import "./_MyCourses.scss";

const PLACEHOLDER_IMAGE = "/images/featured-course-1.png";

const COURSE_STATUSES: CourseStatus[] = [
    "in_progress",
    "overdue",
    "completed_on_time",
    "completed_late",
];

function statusClassName(status: string): string {
    if (status === "completed_on_time" || status === "completed_late") {
        return "completed";
    }
    if (status === "in_progress" || status === "overdue") {
        return "inProgress";
    }
    return "inProgress";
}

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
    const resolvedLocale = locale === "en" || locale === "ar" ? locale : currentLocale;

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

    const { data, isPending, isError, error, isFetching } = useQuery({
        queryKey: getProfileCoursesQueryKey(filters),
        queryFn: () => fetchProfileCourses(resolvedLocale, filters),
        placeholderData: keepPreviousData,
    });

    const summary = data?.summary ?? {};
    const courses = data?.courses ?? [];
    const continueLearning = data?.continueLearning ?? null;

    const assignedCount = summary.total ?? courses.length;
    const completedCount =
        (summary.completedOnTime ?? 0) + (summary.completedLate ?? 0);
    const inProgressCount = summary.inProgress ?? 0;
    const overdueCount = summary.overdue ?? 0;

    const showInitialLoading = isPending && !data;

    return (
        <div className="my_courses">

            {/* -----------------------------------------
                Courses Statistics
            ----------------------------------------- */}

            <div className="courses_stats">

                <div className="course_stat_card">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-book-open" />
                    </div>

                    <strong>
                        {showInitialLoading ? "—" : assignedCount}
                    </strong>

                    <span>
                        {t("stats.assigned")}
                    </span>
                </div>


                <div className="course_stat_card course_stat_completed">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-check" />
                    </div>

                    <strong>
                        {showInitialLoading ? "—" : completedCount}
                    </strong>

                    <span>
                        {t("stats.completed")}
                    </span>
                </div>


                <div className="course_stat_card course_stat_in_progress">
                    <div className="course_stat_icon">
                        <i className="fa-solid fa-play" />
                    </div>

                    <strong>
                        {showInitialLoading ? "—" : inProgressCount}
                    </strong>

                    <span>
                        {t("stats.inProgress")}
                    </span>
                </div>


                <div className="course_stat_card course_stat_not_started">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-minus" />
                    </div>

                    <strong>
                        {showInitialLoading ? "—" : overdueCount}
                    </strong>

                    <span>
                        {t("stats.overdue")}
                    </span>
                </div>


                <div className="course_stat_card course_stat_completion">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-chart-simple" />
                    </div>

                    <strong>
                        —
                    </strong>

                    <span>
                        {t("stats.overallCompletion")}
                    </span>
                </div>

            </div>


            {/* -----------------------------------------
                Resume / Continue Learning
            ----------------------------------------- */}

            {!showInitialLoading && continueLearning ? (
                <div className="resume_course">

                    <div className="resume_course_content">

                        <span className="resume_course_eyebrow">
                            {t("resume.pickUp")}
                        </span>

                        <h3>
                            {continueLearning.title}
                        </h3>

                    </div>


                    {continueLearning.url ? (
                        <a
                            href={continueLearning.url}
                            className="resume_course_button"
                        >
                            <i className="fa-solid fa-play" />

                            <span>
                                {t(`actions.${actionLabelKey(continueLearning.action)}`)}
                            </span>
                        </a>
                    ) : (
                        <button
                            type="button"
                            className="resume_course_button"
                            disabled
                        >
                            <i className="fa-solid fa-play" />

                            <span>
                                {t(`actions.${actionLabelKey(continueLearning.action)}`)}
                            </span>
                        </button>
                    )}

                </div>
            ) : null}


            {/* -----------------------------------------
                Search & Filters
            ----------------------------------------- */}

            <div className="courses_filters">

                <div className="courses_search">

                    <i className="fa-regular fa-magnifying-glass" />

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
                            <option value={category.code} key={category.code}>
                                {category.title}
                            </option>
                        ))}
                    </select>

                    <i className="fa-regular fa-chevron-down" />

                </div>


                <div className="courses_filter">

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus((event.target.value || "") as CourseStatus | "")
                        }
                    >
                        <option value="">
                            {t("filters.allStatuses")}
                        </option>

                        {COURSE_STATUSES.map((value) => (
                            <option value={value} key={value}>
                                {t(`status.${value}`)}
                            </option>
                        ))}
                    </select>

                    <i className="fa-regular fa-chevron-down" />

                </div>

            </div>

            {isCategoriesError ? (
                <p className="text-danger mb-3" role="alert" style={{ fontSize: 14 }}>
                    {categoriesError instanceof Error && categoriesError.message
                        ? categoriesError.message
                        : t("categoriesError")}
                </p>
            ) : null}


            {/* -----------------------------------------
                Courses
            ----------------------------------------- */}

            {showInitialLoading ? (
                <p className="mb-0" style={{ fontSize: 14 }}>
                    {t("loading")}
                </p>
            ) : isError ? (
                <p className="text-danger mb-0" role="alert" style={{ fontSize: 14 }}>
                    {error instanceof Error && error.message
                        ? error.message
                        : t("error")}
                </p>
            ) : courses.length === 0 ? (
                <p className="mb-0" style={{ fontSize: 14 }}>
                    {t("empty")}
                </p>
            ) : (
                <div
                    className="row gx-3"
                    style={isFetching ? { opacity: 0.72 } : undefined}
                >

                    {courses.map((course) => {
                        const courseStatus = String(course.status);
                        const cssStatus = statusClassName(courseStatus);
                        const action = actionLabelKey(course.action as CourseAction | null);
                        const imageSrc = course.coverImage || PLACEHOLDER_IMAGE;
                        const isCompleted =
                            courseStatus === "completed_on_time" ||
                            courseStatus === "completed_late";

                        return (
                            <div
                                className="col-lg-4"
                                key={`${course.id}-${course.code}`}
                            >
                                <div className="course_card">

                                    <div className="course_image">

                                        <Image
                                            src={imageSrc}
                                            alt={course.title}
                                            fill
                                            className="img-cover"
                                        />

                                        {course.categoryTitle ? (
                                            <div className="course_category">
                                                {course.categoryTitle}
                                            </div>
                                        ) : null}

                                        {courseStatus ? (
                                            <div className={`course_status ${cssStatus}`}>
                                                <span className="status_dot" />
                                                {t(`status.${courseStatus}`)}
                                            </div>
                                        ) : null}

                                    </div>

                                    <div className="course_content">

                                        <h3 className="fsz-25 fw-500 mb-2">
                                            {course.title}
                                        </h3>

                                        {course.action ? (
                                            course.url ? (
                                                <a
                                                    href={course.url}
                                                    className={`course_action ${
                                                        isCompleted
                                                            ? "course_action_completed"
                                                            : ""
                                                    }`}
                                                >
                                                    <i className="fa-regular fa-circle-play" />
                                                    {t(`actions.${action}`)}
                                                </a>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={`course_action ${
                                                        isCompleted
                                                            ? "course_action_completed"
                                                            : ""
                                                    }`}
                                                    disabled
                                                >
                                                    <i className="fa-regular fa-circle-play" />
                                                    {t(`actions.${action}`)}
                                                </button>
                                            )
                                        ) : null}

                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default MyCourses;
