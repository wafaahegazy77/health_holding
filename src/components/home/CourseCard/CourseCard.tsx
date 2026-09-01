import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import "./_CourseCard.scss";

interface CourseCardProps {
    course: {
        category: string;
        image: string;
        isFavorite: boolean;
        modulesCount: string;
        title: string;
        description: string;
        hours: string;
        quizzesCount: string;

        // My Courses
        status?: "inProgress" | "completed" | "notStarted";
        completedModules?: string;
        progress?: number;
        lastActivity?: string | null;
    };
}

const CourseCard = async ({
    course,
}: CourseCardProps) => {
    const t = await getTranslations("featuredCourses");
    const coursesT = await getTranslations("profile.courses");

    const statusLabels = {
        inProgress: coursesT("status.inProgress"),
        completed: coursesT("status.completed"),
        notStarted: coursesT("status.notStarted"),
    };

    const actionLabels = {
        inProgress: coursesT("actions.resume"),
        completed: coursesT("actions.review"),
        notStarted: coursesT("actions.start"),
    };

    return (
        <div className="course_card">

            {/* -----------------------------------------
                Course Image
            ----------------------------------------- */}

            <div className="course_image">

                <Link
                    href="https://gamal.inspire-sa.com/scorm/player.html"
                    className="d-block"
                >
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="img-cover"
                    />
                </Link>


                {/* Category */}
                <div className="course_category">
                    {course.category}
                </div>


                {/* Status - My Courses */}
                {course.status && (
                    <div
                        className={`course_status course_status_${course.status}`}
                    >
                        {statusLabels[course.status]}
                    </div>
                )}


                {/* Favorite - UI */}
                {/* <button
                    type="button"
                    className={`favorite_btn ${
                        course.isFavorite ? "active" : ""
                    }`}
                    aria-label="Add to favorites"
                >
                    <i className="fa-regular fa-heart"></i>
                </button> */}

            </div>


            {/* -----------------------------------------
                Course Content
            ----------------------------------------- */}

            <div className="course_content">

                {/* Modules */}
                <div className="course_modules fsz-13">
                    <span>
                        {course.modulesCount} {t("modules")}
                    </span>
                </div>


                {/* Title */}
                <h3 className="fsz-25 fw-500 mb-2">
                    {course.title}
                </h3>


                {/* Description */}
                <p className="fsz-16 mb-3">
                    {course.description}
                </p>


                {/* Course Meta */}
                <div className="course_meta">

                    <span>
                        <b>{course.hours}</b>{" "}
                        {t("hours")}
                    </span>

                    <span className="fw-bold">
                        .
                    </span>

                    <span>
                        <b>{course.quizzesCount}</b>{" "}
                        {t("quizzes")}
                    </span>

                </div>


                {/* -----------------------------------------
                    My Courses Progress
                ----------------------------------------- */}

                {course.status && (
                    <div className="course_progress">

                        {/* Progress Bar */}
                        <div className="progress_bar">

                            <div
                                className={`progress_fill progress_fill_${course.status}`}
                                style={{
                                    width: `${course.progress ?? 0}%`,
                                }}
                            />

                        </div>


                        {/* Progress Info */}
                        <div className="progress_info">

                            <span>
                                {course.completedModules ?? "0"}
                                /
                                {course.modulesCount}{" "}
                                {coursesT("modulesDone")}
                            </span>

                            <strong>
                                {course.progress ?? 0}%
                            </strong>

                        </div>


                        {/* Action Button */}
                        <Link
                            href="https://gamal.inspire-sa.com/scorm/player.html"
                            className={`course_action course_action_${course.status}`}
                        >
                            <i className="fa-regular fa-play" />

                            <span>
                                {actionLabels[course.status]}
                            </span>
                        </Link>


                        {/* Last Activity */}
                        <div className="course_last_activity">
                            {coursesT("lastActivity")}:{" "}
                            {course.lastActivity || "—"}
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default CourseCard;