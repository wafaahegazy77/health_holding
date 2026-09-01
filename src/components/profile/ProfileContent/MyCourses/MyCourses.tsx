import CourseCard from "@/components/home/CourseCard/CourseCard";

import { getTranslations } from "next-intl/server";

import "./_MyCourses.scss";

type CourseStatus =
    | "inProgress"
    | "completed"
    | "notStarted";

type Course = {
    id: number;

    category: {
        en: string;
        ar: string;
    };

    title: {
        en: string;
        ar: string;
    };

    description: {
        en: string;
        ar: string;
    };

    image: string;
    isFavorite: boolean;

    modulesCount: string;
    hours: string;
    quizzesCount: string;

    status: string;

    completedModules: string;
    progress: number;

    lastActivity: string | null;
};

type MyCoursesProps = {
    courses: Course[];
    locale: string;
};

const MyCourses = async ({
    courses,
    locale,
}: MyCoursesProps) => {
    const currentLocale = locale === "ar" ? "ar" : "en";

    const t = await getTranslations("profile.courses");

    const completedCourses = courses.filter(
        (course) => course.status === "completed"
    ).length;

    const inProgressCourses = courses.filter(
        (course) => course.status === "inProgress"
    ).length;

    const notStartedCourses = courses.filter(
        (course) => course.status === "notStarted"
    ).length;

    const overallCompletion =
        courses.length > 0
            ? Math.round(
                  courses.reduce(
                      (total, course) =>
                          total + course.progress,
                      0
                  ) / courses.length
              )
            : 0;

    const resumeCourse = courses.find(
        (course) => course.status === "inProgress"
    );

    const categories = Array.from(
        new Set(
            courses.map(
                (course) =>
                    course.category[currentLocale]
            )
        )
    );

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
                        {courses.length}
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
                        {completedCourses}
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
                        {inProgressCourses}
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
                        {notStartedCourses}
                    </strong>

                    <span>
                        {t("stats.notStarted")}
                    </span>
                </div>


                <div className="course_stat_card course_stat_completion">
                    <div className="course_stat_icon">
                        <i className="fa-regular fa-chart-simple" />
                    </div>

                    <strong>
                        {overallCompletion}%
                    </strong>

                    <span>
                        {t("stats.overallCompletion")}
                    </span>
                </div>

            </div>


            {/* -----------------------------------------
                Resume Course
            ----------------------------------------- */}

            {resumeCourse && (
                <div className="resume_course">

                    <div className="resume_course_content">

                        <span className="resume_course_eyebrow">
                            {t("resume.pickUp")}
                        </span>

                        <h3>
                            {
                                resumeCourse.title[
                                    currentLocale
                                ]
                            }
                        </h3>

                        <div className="resume_progress">

                            <div className="resume_progress_bar">
                                <div
                                    className="resume_progress_fill"
                                    style={{
                                        width: `${resumeCourse.progress}%`,
                                    }}
                                />
                            </div>

                            <span>
                                {resumeCourse.completedModules}/
                                {resumeCourse.modulesCount}{" "}
                                {t("modulesDone")}{" "}
                                —{" "}
                                {resumeCourse.progress}%
                            </span>

                        </div>

                    </div>


                    <a
                        href="https://gamal.inspire-sa.com/scorm/player.html"
                        className="resume_course_button"
                    >
                        <i className="fa-solid fa-play" />

                        <span>
                            {t("actions.resume")}
                        </span>
                    </a>

                </div>
            )}


            {/* -----------------------------------------
                Search & Filters
            ----------------------------------------- */}

            <div className="courses_filters">

                <div className="courses_search">

                    <i className="fa-regular fa-magnifying-glass" />

                    <input
                        type="search"
                        placeholder={t("filters.search")}
                    />

                </div>


                <div className="courses_filter">

                    <select defaultValue="">
                        <option value="">
                            {t("filters.allCategories")}
                        </option>

                        {categories.map((category) => (
                            <option
                                value={category}
                                key={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    <i className="fa-regular fa-chevron-down" />

                </div>


                <div className="courses_filter">

                    <select defaultValue="">
                        <option value="">
                            {t("filters.allStatuses")}
                        </option>

                        <option value="inProgress">
                            {t("status.inProgress")}
                        </option>

                        <option value="completed">
                            {t("status.completed")}
                        </option>

                        <option value="notStarted">
                            {t("status.notStarted")}
                        </option>
                    </select>

                    <i className="fa-regular fa-chevron-down" />

                </div>

            </div>


            {/* -----------------------------------------
                Courses
            ----------------------------------------- */}

            <div className="row gx-3">

                {courses.map((course) => {

                    const status =
                        course.status as CourseStatus;

                    return (
                        <div
                            className="col-lg-4"
                            key={course.id}
                        >
                            <CourseCard
                                course={{
                                    category:
                                        course.category[
                                            currentLocale
                                        ],

                                    title:
                                        course.title[
                                            currentLocale
                                        ],

                                    description:
                                        course.description[
                                            currentLocale
                                        ],

                                    image:
                                        course.image,

                                    isFavorite:
                                        course.isFavorite,

                                    modulesCount:
                                        course.modulesCount,

                                    hours:
                                        course.hours,

                                    quizzesCount:
                                        course.quizzesCount,

                                    status,

                                    completedModules:
                                        course.completedModules,

                                    progress:
                                        course.progress,

                                    lastActivity:
                                        course.lastActivity,
                                }}
                            />
                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default MyCourses;