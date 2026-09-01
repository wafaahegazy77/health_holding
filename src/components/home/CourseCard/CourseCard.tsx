import Image from "next/image";
import { getTranslations } from "next-intl/server";

import "./_CourseCard.scss";
import Link from "next/link";

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
    };
}

const CourseCard = async ({ course }: CourseCardProps) => {
    const t = await getTranslations("featuredCourses");

    return (
        <div className="course_card">

            {/* Course Image - API */}
            <div className="course_image">
                <Link href="https://gamal.inspire-sa.com/scorm/player.html" className="d-block">
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="img-cover"
                    />
                </Link>

                {/* Category - API */}
                <div className="course_category">
                    {course.category}
                </div>

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


            {/* Course Content */}
            <div className="course_content">

                {/* Modules - API + Translation */}
                <div className="course_modules fsz-13">
                    <span>
                        {course.modulesCount} {t("modules")}
                    </span>
                </div>


                {/* Title - API */}
                <h3 className="fsz-25 fw-500 mb-2">
                    {course.title}
                </h3>


                {/* Description - API */}
                <p className="fsz-16 mb-3">
                    {course.description}
                </p>


                {/* Course Meta */}
                <div className="course_meta">

                    {/* Hours - API + Translation */}
                    <span>
                       <b> {course.hours} </b> {t("hours")}
                    </span>

                    <span className="fw-bold "> . </span>

                    {/* Quizzes - API + Translation */}
                    <span>
                       <b> {course.quizzesCount} </b> {t("quizzes")}
                    </span>

                </div>

            </div>

        </div>
    );
};

export default CourseCard;