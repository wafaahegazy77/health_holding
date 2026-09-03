import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_CEOMessage.scss";

const CEOMessage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("ceo");

    const data = await getHomeData(locale);

    return (
        <section className="ceo_message section">
            <div className="container ">

                {/* Content */}
                <div className="row align-items-center justify-content-around">

                    {/* CEO Image */}
                    <div className="col-lg-5">
                        <Reveal
                            animation="fade-up"
                            trigger="load"
                        >
                            <div className="ceo_image">
                                <Image
                                    src={data.ceo.image}
                                    alt={data.ceo.name}
                                    fill
                                    className="img-cover"
                                />

                                <div className="ceo_info">
                                    <h3 className="fsz-20 fw-500 mb-1">
                                        {data.ceo.name}
                                    </h3>

                                    <span className="fsz-14">
                                        {data.ceo.position}
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* CEO Message */}
                    <div className="col-lg-7">

                        {/* Section Header */}
                        <div className="sec_head mb-5">

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="badge bg-white0 color_primary fw-400 mb-3">
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

                        <div className="ceo_content px-5">

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="message_mark bg-white">
                                    <i className="fa-regular fa-quote-left" />
                                </div>
                            </Reveal>

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <p className="description fsz-18 mb-4">
                                    {data.ceo.description}
                                </p>
                            </Reveal>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default CEOMessage;