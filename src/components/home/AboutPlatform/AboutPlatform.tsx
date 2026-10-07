import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getAboutSection } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_AboutPlatform.scss";

const AboutPlatform = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutPlatform");
    const about = await getAboutSection(locale);

    return (
        <section className="about_platform section" id="about">
            <div className="container">
                <div className="sec_head d-flex mb-5 ">
                    {/* Eyebrow */}
                    <Reveal animation="fade-up" trigger="load">
                        <div className="badge bg-white color_primary fw-400 mb-3">
                            <img
                                src="/images/icons/curve.svg"
                                className="icon icon-20 "
                                alt=""
                            />
                            {t("eyebrow")}
                        </div>
                    </Reveal>

                    {/* Title */}
                    {about.title ? (
                        <Reveal animation="fade-up" trigger="load">
                            <h2 className="title fsz-50 fw-400 mb-4">{about.title}</h2>
                        </Reveal>
                    ) : null}
                </div>
                <div className="row align-items-center">
                    {/* Images */}
                    <div className="col-lg-6">
                        <div className="about_images">
                            <div className="row align-items-end gx-3">
                                <div className="col-6">
                                    {about.image_1 ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <div className="image_small">
                                                <Image
                                                    src={about.image_1}
                                                    alt=""
                                                    fill
                                                    className="img-cover"
                                                />
                                            </div>
                                        </Reveal>
                                    ) : null}
                                </div>
                                <div className="col-6">
                                    {about.image_2 ? (
                                        <Reveal animation="fade-up" trigger="load">
                                            <div className="image_large">
                                                <Image
                                                    src={about.image_2}
                                                    alt=""
                                                    fill
                                                    className="img-cover"
                                                />
                                            </div>
                                        </Reveal>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="col-lg-6 order_md_1">
                        <div className="txt_content">
                            {about.description ? (
                                <Reveal animation="fade-up" trigger="load">
                                    <p className="description fsz-16 mb-4">
                                        {about.description}
                                    </p>
                                </Reveal>
                            ) : null}

                            {about.features.length > 0 ? (
                                <div className="features pt-3">
                                    {about.features.map((feature, index) => (
                                        <Reveal
                                            key={`${feature.title}-${index}`}
                                            animation="fade-up"
                                            trigger="load"
                                        >
                                            <div className="feature_item mb-3">
                                                {feature.icon ? (
                                                    <div className="feature_icon">
                                                        <Image
                                                            src={feature.icon}
                                                            alt=""
                                                            className="icon icon-18 img-contain "
                                                            width={18}
                                                            height={18}
                                                        />
                                                    </div>
                                                ) : null}

                                                <div className="feature_content">
                                                    {feature.title ? (
                                                        <h3 className="fsz-18 fw-500 mb-2">
                                                            {feature.title}
                                                        </h3>
                                                    ) : null}

                                                    {feature.description ? (
                                                        <p className="fsz-14 mb-0">
                                                            {feature.description}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPlatform;
