import { getLocale, getTranslations } from "next-intl/server";

import { getHeroSection } from "@/lib/api/home";
import HomeAuthButton from "@/components/home/HomeAuthButton";
import "./_Hero.scss";
import HeroVisual from "./HeroVisual";

const Hero = async () => {
    const locale = await getLocale();
    const t = await getTranslations("hero");
    const hero = await getHeroSection(locale);

    return (
        <section className="hero_section section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="txt_content">
                            <div className="badge bg-white fw-400 mb-3">
                                <img
                                    src="/images/icons/shield_check.svg"
                                    className="icon icon-20 "
                                    alt=""
                                />
                                <span className="txt txt_gradient fw-200">{t("eyebrow")}</span>
                            </div>

                            {hero.main_title || hero.subtitle ? (
                                <h1 className="title fsz-60 fw-500 mb-3 ">
                                    {hero.main_title ? <span>{hero.main_title} </span> : null}
                                    {hero.subtitle ? (
                                        <span className="txt_gradient fw-600 ">
                                            {hero.subtitle}
                                        </span>
                                    ) : null}
                                </h1>
                            ) : null}

                            {hero.description ? (
                                <p className="hero_description fsz-16 mb-4">
                                    {hero.description}
                                </p>
                            ) : null}

                            <div className="butns_box d-flex align-items-center pt-3">
                                <HomeAuthButton
                                    className="butn gradient_butn hvr-icon-slide-out-in"
                                    guestLabel={t("logInButn")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="hero_stat">
                <div className="hero_stat_icon bg_gradient text-white ">
                    <i className="fa-regular fa-heart-pulse"></i>
                </div>

                <div className="counter mt-3 fsz-45 fw-500 d-flex align-items-center justify-content-center ">
                    <span className="prata-font">
                        <NumberCounter
                            value={Number(data.hero.specialtiesCount)}
                        />
                    </span>

                    <small className="fsz-25 fw-300">+</small>
                </div>

                <div className="label mt-0 fsz-14 ">{t("specialties")}</div>
            </div> */}

            {/* <Image
                src="/images/hero_pattern.png"
                className="bg"
                alt=""
                fill
                priority
            /> */}

            <HeroVisual />
        </section>
    );
};

export default Hero;
