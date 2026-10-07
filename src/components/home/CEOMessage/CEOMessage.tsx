import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getCeoSection } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_CEOMessage.scss";

const CEOMessage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("ceo");
    const ceo = await getCeoSection(locale);

    return (
        <section className="ceo_message section">
            <div className="container ">

                {/* Content */}
                <div className="row align-items-center justify-content-around">

                    {/* CEO Image */}
                    <div className="col-lg-5">
                        {ceo.image || ceo.manager_name || ceo.job_title ? (
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <div className="ceo_image">
                                    {ceo.image ? (
                                        <Image
                                            src={ceo.image}
                                            alt={ceo.manager_name}
                                            fill
                                            className="img-cover"
                                        />
                                    ) : null}

                                    {ceo.manager_name || ceo.job_title ? (
                                        <div className="ceo_info">
                                            {ceo.manager_name ? (
                                                <h3 className="fsz-20 fw-500 mb-1">
                                                    {ceo.manager_name}
                                                </h3>
                                            ) : null}

                                            {ceo.job_title ? (
                                                <span className="fsz-14">
                                                    {ceo.job_title}
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </Reveal>
                        ) : null}
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

                            {ceo.title ? (
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h2 className="title fsz-50 fw-400 mb-4">
                                        {ceo.title}
                                    </h2>
                                </Reveal>
                            ) : null}

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

                            {ceo.description ? (
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <p className="description fsz-18 mb-4">
                                        {ceo.description}
                                    </p>
                                </Reveal>
                            ) : null}

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default CEOMessage;
