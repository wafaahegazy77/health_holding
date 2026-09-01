import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";
import "./_Hero.scss";
import NumberCounter from "@/components/NumberCounter";

const Hero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("hero");

    const data = await getHomeData(locale);

    return (
        <section className="hero_section section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="txt_content">
                            {/* Eyebrow */}
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="badge bg-white color_primary fw-400 mb-3">
                                    <img src="/images/icons/shield_check.svg" className="icon icon-20 " alt="" />
                                    {t("eyebrow")}
                                </div>
                            </Reveal>


                            {/* Title */}
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <h1 className="title fsz-60 fw-500 mb-3 ">
                                    <span className="">
                                        {t("title")}{" "}
                                    </span>

                                    <span className="txt_gradient fw-600 ">
                                        {t("highlightedTitle")}
                                    </span>
                                </h1>
                            </Reveal>


                            {/* Description */}
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <p className="hero_description fsz-16 mb-4">
                                    {data.hero.description}
                                </p>
                            </Reveal>

                            {/* butns_boxs */}
                            <div className="butns_box d-flex align-items-center pt-3">
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <Link
                                        href="/register"
                                        className="butn white_butn hvr-icon-slide-out-in"
                                    >
                                        <div className="txt" >
                                            {t("signUpButn")}
                                        </div>

                                        {/* Current icon */}
                                        <span className="hvr-icon hvr-icon-current">
                                            <i className="fa-regular fa-arrow-up-right"></i>
                                        </span>

                                        {/* Next icon */}
                                        <span className="hvr-icon hvr-icon-next">
                                            <i className="fa-regular fa-arrow-right"></i>
                                        </span>
                                    </Link>
                                </Reveal>
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <Link
                                        href="/login"
                                        className="butn gradient_butn hvr-icon-slide-out-in"
                                    >
                                        <div className="txt" >
                                            {t("logInButn")}
                                        </div>

                                        {/* Current icon */}
                                        <span className="hvr-icon hvr-icon-current">
                                            <i className="fa-regular fa-arrow-up-right"></i>
                                        </span>

                                        {/* Next icon */}
                                        <span className="hvr-icon hvr-icon-next">
                                            <i className="fa-regular fa-arrow-right"></i>
                                        </span>
                                    </Link>
                                </Reveal>

                            </div>


                        </div>
                    </div>

                </div>

            </div>

            {/* Specialties Statistic */}
            <div className="hero_stat">

                <div className="hero_stat_icon bg_gradient text-white ">
                    <i className="fa-regular fa-heart-pulse"></i>
                </div>

                <div className="counter mt-3 fsz-45 fw-500 d-flex align-items-center justify-content-center ">
                    <span className="prata-font">
                        <NumberCounter
                            value={Number(data.hero.specialtiesCount)}
                        />
                    </span>

                    <small className="fsz-25 fw-300">
                        +
                    </small>
                </div>

                <div className="label mt-0 fsz-14 ">
                    {t("specialties")}
                </div>

            </div>

            {/* hero_pattern Image */}
            <Image
                src="/images/hero_pattern.png"
                className="bg"
                alt=""
                fill
                priority
            />

            {/* DNA Image */}
            <Image
                src="/images/hero-1.png"
                className="dna"
                alt=""
                fill
                priority
            />
        </section>
    );
};

export default Hero;