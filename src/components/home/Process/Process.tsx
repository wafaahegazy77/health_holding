import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";
import ProcessSteps from "./ProcessSteps";

import "./_Process.scss";

const Process = async () => {
    const locale = await getLocale();
    const t = await getTranslations("process");

    const data = await getHomeData(locale);

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


                            {/* Description - API */}
                            <Reveal
                                animation="fade-up"
                                trigger="load"
                            >
                                <p className="description fsz-16 mb-0">
                                    {data.process.description}
                                </p>
                            </Reveal>

                        </div>
                    </div>


                    {/* Process Stack */}
                    <div className="col-lg-7">
                        <ProcessSteps
                            steps={data.process.steps}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Process;