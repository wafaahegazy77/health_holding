import { getLocale, getTranslations } from "next-intl/server";

import { getProcessSection } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";
import ProcessSteps from "./ProcessSteps";

import "./_Process.scss";

const Process = async () => {
    const locale = await getLocale();
    const t = await getTranslations("process");
    const process = await getProcessSection(locale);
    const description = process.description || t("description");

    return (
        <section className="process section pt-100" id="process">
            <div className="container">
                <div className="row">

                    {/* Content */}
                    <div className="col-lg-5">
                        <div className="txt_content">

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
                                <h2 className="title fsz-35 fw-500 mb-3">
                                    {t("title")}
                                </h2>
                            </Reveal>


                            {description ? (
                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <p className="description fsz-16 mb-4">
                                        {description}
                                    </p>
                                </Reveal>
                            ) : null}

                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <Link
                                    href="/login"
                                    className="butn white_butn hvr-icon-slide-out-in"
                                >
                                    <div className="txt">{t("cta")}</div>

                                    <span className="hvr-icon hvr-icon-current">
                                        <i className="fa-regular fa-arrow-up-right"></i>
                                    </span>

                                    <span className="hvr-icon hvr-icon-next">
                                        <i className="fa-regular fa-arrow-right"></i>
                                    </span>
                                </Link>
                            </Reveal>

                        </div>
                    </div>


                    {/* Process Stack */}
                    <div className="col-lg-7">
                        {process.items.length > 0 ? (
                            <ProcessSteps
                                steps={process.items}
                            />
                        ) : null}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Process;
