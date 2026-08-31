import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";
import NumberCounter from "@/components/NumberCounter";

import "./_Stats.scss";

const Stats = async () => {
    const locale = await getLocale();
    const t = await getTranslations("stats");

    const data = await getHomeData(locale);

    return (
        <section className="stats section">
            <div className="container-fluid px-5">

                <div className="stats_box">

                    <div className="row">

                        {/* Active Learners */}
                        <div className="col-lg-3 col-md-6">
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="stat_item">

                                    <div className="stat_content">

                                        <div className="counter fsz-30 fw-500">
                                            <NumberCounter
                                                value={
                                                    data.stats.activeLearners
                                                }
                                            />
                                            <span>+</span>
                                        </div>

                                        <p className="fsz-16 text-white-50 mb-0">
                                            {t("activeLearners")}
                                        </p>

                                    </div>

                                </div>
                            </Reveal>
                        </div>


                        {/* Expert Instructors */}
                        <div className="col-lg-3 col-md-6">
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="stat_item">

                                    <div className="stat_content">

                                        <div className="counter fsz-30 fw-500">
                                            <NumberCounter
                                                value={
                                                    data.stats.expertInstructors
                                                }
                                            />
                                            <span>+</span>
                                        </div>

                                        <p className="fsz-16 text-white-50 mb-0">
                                            {t("expertInstructors")}
                                        </p>

                                    </div>

                                </div>
                            </Reveal>
                        </div>


                        {/* Courses & Modules */}
                        <div className="col-lg-3 col-md-6">
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="stat_item">

                                    <div className="stat_content">

                                        <div className="counter fsz-30 fw-500">
                                            <NumberCounter
                                                value={
                                                    data.stats.coursesAndModules
                                                }
                                            />
                                            <span>+</span>
                                        </div>

                                        <p className="fsz-16 text-white-50 mb-0">
                                            {t("coursesAndModules")}
                                        </p>

                                    </div>

                                </div>
                            </Reveal>
                        </div>


                        {/* Satisfaction Rate */}
                        <div className="col-lg-3 col-md-6">
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="stat_item">

                                    <div className="stat_content">

                                        <div className="counter fsz-30 fw-500">
                                            <NumberCounter
                                                value={
                                                    data.stats.satisfactionRate
                                                }
                                            />
                                            <span>%</span>
                                        </div>

                                        <p className="fsz-16 text-white-50 mb-0">
                                            {t("satisfactionRate")}
                                        </p>

                                    </div>

                                </div>
                            </Reveal>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Stats;