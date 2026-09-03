import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_Faqs.scss";
import FaqAccordion from "./FaqAccordion";

const Faqs = async () => {
    const locale = await getLocale();
    const t = await getTranslations("faqs");

    const data = await getHomeData(locale);

    return (
        <section className="faqs section" id="faqs">
            <div className="container">

                {/* Section Head */}
                <div className="sec_head text-center mb-4">

                    {/* Eyebrow - Translation */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <div className="badge color_primary fw-400 mb-3 mx-auto">
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
                        <h2 className="title fsz-40 fw-500 mb-0">
                            {t("title")}
                        </h2>
                    </Reveal>

                </div>


                {/* FAQ Items - API */}
                <Reveal animation="fade-up">
                    <div className="faqs_wrapper">
                        <FaqAccordion
                            items={data.faqs.items}
                        />
                    </div>
                </Reveal>

            </div>
        </section>
    );
};

export default Faqs;