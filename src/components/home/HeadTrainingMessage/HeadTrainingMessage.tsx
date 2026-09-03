import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_HeadTrainingMessage.scss";

const HeadTrainingMessage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("headTraining");

    const data = await getHomeData(locale);

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

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <h2 className="title fsz-50 fw-400 mb-4">
                                    {t("title")}
                                </h2>
                            </Reveal>

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

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <p className="description fsz-18 mb-4">
                                    {data.headTraining.description}
                                </p>
                            </Reveal>

                        </div>
                    </div>

                    {/* Image */}
                    <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
                        <Reveal
                            animation="fade-up"
                            trigger="load"
                        >
                            <div className="head_training_image">
                                <Image
                                    src={data.headTraining.image}
                                    alt={data.headTraining.name}
                                    fill
                                    className="img-cover"
                                />

                                <div className="head_training_info">
                                    <h3 className="fsz-20 fw-500 mb-1">
                                        {data.headTraining.name}
                                    </h3>

                                    <span className="fsz-14">
                                        {data.headTraining.position}
                                    </span>
                                </div>

                            </div>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeadTrainingMessage;