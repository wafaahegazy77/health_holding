import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_PlatformFeatures.scss";

const PlatformFeatures = async () => {
    const locale = await getLocale();
    const t = await getTranslations("platformFeatures");

    const data = await getHomeData(locale);

    return (
        <section className="platform_features section pb-0" id="platform-features">
            <div className="container">

                {/* Section Head */}
                <div className="row align-items-end mb-5">

                    <div className="col-lg-6">
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

                        {/* Title - Translation */}
                        <Reveal
                            animation="fade-up"
                            trigger="load"
                        >
                            <h2 className="title fsz-35 fw-500 mb-0">
                                {t("title")}
                            </h2>
                        </Reveal>
                    </div>


                    <div className="col-lg-4 offset-lg-2">
                        {/* Description - API */}
                        <Reveal
                            animation="fade-up"
                            trigger="load"
                        >
                            <p className="description fsz-16 mb-0">
                                {data.platformFeatures.description}
                            </p>
                        </Reveal>
                    </div>

                </div>


                {/* Features */}
                <div className="row gx-2">

                    {data.platformFeatures.features.map(
                        (feature, index) => (
                            <div
                                className="col-lg col-md-6"
                                key={index}
                            >
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <div className="feature_item">

                                        {/* Icon - API */}
                                        <div className="feature_icon">
                                            <Image
                                                src={feature.icon}
                                                alt=""
                                                width={50}
                                                height={50}
                                                className="icon"
                                            />
                                        </div>

                                        {/* Content - API */}
                                        <h3 className="fsz-18 fw-500 mb-3">
                                            {feature.title}
                                        </h3>

                                        <p className="fsz-13 mb-0">
                                            {feature.description}
                                        </p>

                                    </div>
                                </Reveal>
                            </div>
                        )
                    )}

                </div>

                <hr className="mt-100"/>
            </div>

        </section>
    );
};

export default PlatformFeatures;