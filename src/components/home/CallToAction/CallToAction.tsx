import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";

import "./_CallToAction.scss";

const CallToAction = async () => {
    const locale = await getLocale();
    const t = await getTranslations("callToAction");

    const data = await getHomeData(locale);

    return (
        <section className="call_to_action section">
            <div className="container">

                <div className="cta_box">

                    {/* Title */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <h2 className="title fsz-45 fw-500 mb-4">
                            {t("title")}
                        </h2>
                    </Reveal>


                    {/* Description - API */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <p className="description fsz-20 mb-4 col-lg-6 mx-auto">
                            {data.callToAction.description}
                        </p>
                    </Reveal>


                    {/* Buttons */}
                    <div className="butns_box d-flex align-items-center justify-content-center pt-3">
                        <Reveal
                            animation="fade-up"
                            trigger="load"
                        >
                            <Link
                                href="/"
                                className="butn white_butn hvr-icon-slide-out-in"
                            >
                                <div className="txt" >
                                    {t("createAccount")}
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
                                href="/"
                                className="butn gradient_butn hvr-icon-slide-out-in"
                            >
                                <div className="txt" >
                                    {t("login")}
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
        </section>
    );
};

export default CallToAction;