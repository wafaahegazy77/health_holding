import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHeadTrainingSection } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_HeadTrainingMessage.scss";

const HeadTrainingMessage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("headTraining");
    const headTraining = await getHeadTrainingSection(locale);

    return (
        <section className="head_training_message section">
            <div className="container">
                <div className="row align-items-center">

                    {/* Content */}
                    <div className="col-lg-6 order-2 order-lg-1">

                        <div className="sec_head mb-4">

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="badge bg_blue color_primary fw-400 mb-3">
                                    <img
                                        src="/images/icons/curve.svg"
                                        className="icon icon-20"
                                        alt=""
                                    />
                                    {t("eyebrow")}
                                </div>
                            </Reveal>

                            {headTraining.title ? (
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h2 className="title fsz-50 fw-400 mb-4">
                                        {headTraining.title}
                                    </h2>
                                </Reveal>
                            ) : null}

                        </div>
                        <div className="head_training_content px-4">

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="message_mark">
                                    <i className="fa-regular fa-quote-left" />
                                </div>
                            </Reveal>

                            {headTraining.description ? (
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <p className="description fsz-18 mb-4">
                                        {headTraining.description}
                                    </p>
                                </Reveal>
                            ) : null}

                        </div>
                    </div>

                    {/* Image */}
                    <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
                        {headTraining.image || headTraining.manager_name || headTraining.job_title ? (
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="head_training_image">
                                    {headTraining.image ? (
                                        <Image
                                            src={headTraining.image}
                                            alt={headTraining.manager_name}
                                            fill
                                            className="img-cover"
                                        />
                                    ) : null}

                                    {headTraining.manager_name || headTraining.job_title ? (
                                        <div className="head_training_info">
                                            {headTraining.manager_name ? (
                                                <h3 className="fsz-20 fw-500 mb-1">
                                                    {headTraining.manager_name}
                                                </h3>
                                            ) : null}

                                            {headTraining.job_title ? (
                                                <span className="fsz-14">
                                                    {headTraining.job_title}
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}

                                </div>
                            </Reveal>
                        ) : null}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeadTrainingMessage;
