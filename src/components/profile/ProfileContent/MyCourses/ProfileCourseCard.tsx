"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Course, CourseAction, CourseCategory } from "@/lib/api/profile";

type ProfileCourseCardProps = {
    course: Course;
    categories?: CourseCategory[];
};

function isCategoryCode(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return false;

    // API hashed codes like CAT-mggstq
    if (/^CAT[-_]/i.test(trimmed)) return true;
    if (/^[A-Z]{2,}[-_][a-z0-9]+$/i.test(trimmed)) return true;

    return false;
}

function resolveCategoryLabel(
    course: Course,
    categories: CourseCategory[] = [],
) {
    const title = course.categoryTitle.trim();
    const code = course.categoryCode.trim();

    if (title && !isCategoryCode(title)) {
        return title;
    }

    const matched = categories.find((category) => {
        const categoryCode = category.code.trim();
        return (
            categoryCode === code ||
            categoryCode === title ||
            // Match hashed ids whether or not they include a CAT- prefix
            categoryCode.replace(/^CAT[-_]/i, "") ===
                code.replace(/^CAT[-_]/i, "") ||
            categoryCode.replace(/^CAT[-_]/i, "") ===
                title.replace(/^CAT[-_]/i, "")
        );
    });

    if (matched?.title && !isCategoryCode(matched.title)) {
        return matched.title;
    }

    return "";
}

function statusClassName(status: string) {
    if (status === "completed_on_time" || status === "completed_late") {
        return "completed";
    }

    if (status === "overdue") {
        return "overdue";
    }

    return "inProgress";
}

function actionLabelKey(action: Course["action"]): "start" | "resume" | "review" {
    if (action === "start" || action === "resume" || action === "review") {
        return action;
    }

    return "resume";
}

const ProfileCourseCard = ({
    course,
    categories = [],
}: ProfileCourseCardProps) => {
    const t = useTranslations("profile.courses");
    const categoryLabel = resolveCategoryLabel(course, categories);

    const courseStatus = String(course.status);
    const cssStatus = statusClassName(courseStatus);
    const action = actionLabelKey(course.action as CourseAction | null);
    const actionLabel = t(`actions.${action}`);

    const isCompleted =
        courseStatus === "completed_on_time" ||
        courseStatus === "completed_late";

    const progress = course.progress;
    const completedModules = course.completedModules;
    const modulesCount = course.modulesCount;

    const hasModules = completedModules !== null && modulesCount !== null;
    const hasProgress = progress !== null;

    const actionClassName = isCompleted
        ? "course_action course_action_completed"
        : "course_action";

    const progressClassName =
        isCompleted || progress === 100
            ? "course_progress is_completed"
            : "course_progress";

    return (
        <div className={`course_card profile_course_card status_${cssStatus}`}>

            <div className={`course_image header_${cssStatus}`}>

                {course.coverImage ? (
                    <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="img-cover"
                    />
                ) : null}

                <div className="course_header_badges">
                    {categoryLabel ? (
                        <div className="course_category">
                            {categoryLabel}
                        </div>
                    ) : (
                        <span></span>
                    )}

                    {courseStatus ? (
                        <div className={`course_status ${cssStatus}`}>
                            {t(`status.${courseStatus}`)}
                        </div>
                    ) : null}
                </div>

            </div>

            <div className="course_content">

                <h3>
                    {course.title}
                </h3>

                <div className="course_meta_row">

                    {course.hours !== null ? (
                        <span>
                            <i className="fa-regular fa-clock"></i>
                            {t("meta.hours", { count: course.hours })}
                        </span>
                    ) : null}

                    {modulesCount !== null ? (
                        <span>
                            <i className="fa-regular fa-layer-group"></i>
                            {t("meta.modules", { count: modulesCount })}
                        </span>
                    ) : null}

                    {course.quizzesCount !== null ? (
                        <span>
                            <i className="fa-regular fa-chart-simple"></i>
                            {t("meta.quizzes", { count: course.quizzesCount })}
                        </span>
                    ) : null}

                </div>

                {hasModules || hasProgress ? (
                    <div className={progressClassName}>

                        <div className="progress_bar">
                            <span style={{ width: `${progress ?? 0}%` }}></span>
                        </div>

                        <div className="progress_info">
                            <span>
                                {hasModules
                                    ? `${completedModules}/${modulesCount} ${t("modulesDone")}`
                                    : null}
                            </span>
                            <span>
                                {hasProgress ? `${progress}%` : null}
                            </span>
                        </div>

                    </div>
                ) : null}

                {course.action && course.url ? (
                    <a
                        href={course.url}
                        className={actionClassName}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {actionLabel}
                    </a>
                ) : null}

                {course.action && !course.url ? (
                    <button
                        type="button"
                        className={actionClassName}
                        disabled
                    >
                        {actionLabel}
                    </button>
                ) : null}

                {course.lastActivity ? (
                    <p className="course_last_activity">
                        {t("lastActivity")}: {course.lastActivity}
                    </p>
                ) : null}

            </div>

        </div>
    );
};

export default ProfileCourseCard;
