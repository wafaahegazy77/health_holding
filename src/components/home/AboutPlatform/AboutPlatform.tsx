import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_AboutPlatform.scss";

const AboutPlatform = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPlatform");

    const data = await getHomeData(locale);

    return (
        <section className="about_platform section" id="about">
            <div className="container">
                <div className="sec_head d-flex mb-5 ">

                    {/* Eyebrow */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <div className="badge bg-white color_primary fw-400 mb-3">
                            <img src="/images/icons/curve.svg" className="icon icon-20 " alt="" />
                            {t("eyebrow")}
                        </div>
                    </Reveal>


                    {/* Title */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <h2 className="title fsz-50 fw-400 mb-4">
                            {t("title")}
                        </h2>
                    </Reveal>
                </div>
                <div className="row align-items-center">

                    {/* Images */}
                    <div className="col-lg-6">
                        <div className="about_images">
                            <div className="row align-items-end gx-3">
                                <div className="col-6">
                                    <Reveal
                                        animation="fade-up"
                                        trigger="load"
                                    >
                                        <div className="image_small">
                                            <Image
                                                src="/images/about-1.png"
                                                alt=""
                                                fill
                                                className="img-cover"
                                            />
                                        </div>
                                    </Reveal>
                                </div>
                                <div className="col-6">
                                    <Reveal
                                        animation="fade-up"
                                        trigger="load"
                                    >
                                        <div className="image_large">
                                            <Image
                                                src="/images/about-2.png"
                                                alt=""
                                                fill
                                                className="img-cover"
                                            />
                                        </div>
                                    </Reveal>
                                </div>
                            </div>





                        </div>
                    </div>


                    {/* Content */}
                    <div className="col-lg-6 order_md_1">
                        <div className="txt_content">



                            {/* Description */}
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <p className="description fsz-16 mb-4">
                                    {data.aboutPlatform.description}
                                </p>
                            </Reveal>


                            {/* Features */}
                            <div className="features pt-3">

                                {data.aboutPlatform.features.map(
                                    (feature, index) => (
                                        <Reveal
                                            key={index}
                                            animation="fade-up"
                                            trigger="load"
                                        >
                                            <div className="feature_item mb-3">

                                                <div className="feature_icon">
                                                    <Image
                                                        src={`/images/icons/about-platform-${index + 1}.svg`}
                                                        alt=""
                                                        className="icon icon-18 img-contain "
                                                        width={18}
                                                        height={18}
                                                    />
                                                </div>

                                                <div className="feature_content">
                                                    <h3 className="fsz-18 fw-500 mb-2">
                                                        {feature.title}
                                                    </h3>

                                                    <p className="fsz-14 mb-0">
                                                        {feature.description}
                                                    </p>
                                                </div>

                                            </div>
                                        </Reveal>
                                    )
                                )}

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutPlatform;