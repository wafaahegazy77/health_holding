import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";
import CourseCard from "@/components/home/CourseCard/CourseCard";

import "./_FeaturedCourses.scss";

const FeaturedCourses = async () => {
    const locale = await getLocale();
    const t = await getTranslations("featuredCourses");

    const data = await getHomeData(locale);

    return (
        <section className="featured_courses section" id="courses">
            <div className="container">

                {/* Section Head */}
                <div className="sec_head mb-5">

                    {/* Eyebrow - Translation */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <div className="badge color_primary fw-400 mb-3">
                            <img
                                src="/images/icons/curve.svg"
                                className="icon icon-20"
                                alt=""
                            />
                            {t("eyebrow")}
                        </div>
                    </Reveal>

                    {/* Title - API */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <h2 className="title fsz-40 fw-500 mb-3">
                            {t("title")}
                        </h2>
                    </Reveal>

                </div>


                {/* Courses */}
                <div className="row">

                    {data.featuredCourses.courses.map(
                        (course, index) => (
                            <div
                                className="col-lg-4 col-md-6"
                                key={index}
                            >
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <CourseCard
                                        course={course}
                                    />
                                </Reveal>
                            </div>
                        )
                    )}

                </div>

            </div>
        </section>
    );
};

export default FeaturedCourses;