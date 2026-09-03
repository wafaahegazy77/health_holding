import Image from "next/image";
import { getTranslations } from "next-intl/server";

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

        status?: "inProgress" | "completed" | "notStarted";
        completedModules?: string;
        progress?: number;
        lastActivity?: string | null;
    };
}

const CourseCard = async ({ course }: CourseCardProps) => {
    const t = await getTranslations("featuredCourses");
    const profileT = await getTranslations("profile.courses");

    const isProfileCourse = course.status !== undefined;

    return (
        <div className="course_card">

            {/* Course Image */}
            <div className="course_image">

                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="img-cover"
                />

                {/* Category */}
                <div className="course_category">
                    {course.category}
                </div>

                {/* Status - Profile */}
                {isProfileCourse && (
                    <div className={`course_status ${course.status}`}>
                        <span className="status_dot" />
                        {profileT(`status.${course.status}`)}
                    </div>
                )}

            </div>


            {/* Course Content */}
            <div className="course_content">

                    {/* Last Activity */}
                    {isProfileCourse && course.lastActivity && (
                        <div className="fsz-12 mb-2">
                            <span className="course_date">
                                <i className="fa-regular fa-calendar" />
                                {course.lastActivity}
                            </span>
                        </div>
                    )}



                {/* Title */}
                <h3 className="fsz-25 fw-500 mb-2">
                    {course.title}
                </h3>


                {/* Description */}
                <p className="fsz-16 mb-3">
                    {course.description}
                </p>


                {/* Progress - Profile */}
                {isProfileCourse && (
                    <div className="course_progress">

                        <div className="progress_info">
                            <span>
                                {course.completedModules}/
                                {course.modulesCount}{" "}
                                {profileT("modulesDone")}
                            </span>

                            <span>
                                {course.progress}%
                            </span>
                        </div>

                        <div
                            className={`progress_bar ${
                                course.progress === 100 ? "completed" : ""
                            }`}
                        >
                            <span
                                style={{
                                    width: `${course.progress}%`,
                                }}
                            />
                        </div>

                    </div>
                )}


                {/* Course Meta */}
                <div className="course_meta mb-4">

                    <span>
                        <b>{course.hours}</b>{" "}
                        {t("hours")}
                    </span>

                    <span className="fw-bold">.</span>

                    <span>
                        <b>{course.quizzesCount}</b>{" "}
                        {t("quizzes")}
                    </span>

                    <span className="fw-bold">.</span>

                    <span>
                        <b>  {course.modulesCount} </b> {t("modules")}
                    </span>

                </div>


                {isProfileCourse && (
                    <button
                        type="button"
                        className={`course_action ${
                            course.status === "completed"
                                ? "course_action_completed"
                                : ""
                        }`}
                    >
                        <i className="fa-regular fa-circle-play" />

                        {profileT(
                            course.status === "completed" && course.progress === 100
                                ? "actions.review"
                                : course.status === "notStarted"
                                    ? "actions.start"    
                                    : "actions.resume"
                        )}
                    </button>
                )}

            </div>


        </div>
    );
};

export default CourseCard;