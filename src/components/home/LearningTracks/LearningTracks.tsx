import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { getHomeData } from "@/lib/api/home";
import Reveal from "@/components/animations/Reveal";

import "./_LearningTracks.scss";

const LearningTracks = async () => {
    const locale = await getLocale();
    const t = await getTranslations("learningTracks");

    const data = await getHomeData(locale);

    return (
        <section className="learning_tracks section" id="tracks">
            <div className="container">

                {/* Section Head */}
                <div className="sec_head text-center mb-5">

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


                    {/* Title - API */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <h2 className="title fsz-40 fw-500 mb-3">
                            {data.learningTracks.title}
                        </h2>
                    </Reveal>


                    {/* Description - API */}
                    <Reveal
                        animation="fade-up"
                        trigger="load"
                    >
                        <p className="description fsz-14 mb-0">
                            {data.learningTracks.description}
                        </p>
                    </Reveal>

                </div>


                {/* Tracks */}
                <div className="tracks_wrapper">
                    <div className="row justify-content-center g-3">

                        {data.learningTracks.tracks.map(
                            (track, index) => (
                                <div
                                    className="col-lg-4 col-md-6"
                                    key={index}
                                >
                                    <Reveal
                                        animation="fade-up"
                                        trigger="load"
                                    >
                                        <div
                                            className={`track_card ${
                                                index === 0 ? "active" : ""
                                            }`}
                                        >

                                            {/* Track Icon - API */}
                                            <div className="track_icon">
                                                <Image
                                                    src={track.icon}
                                                    alt=""
                                                    width={80}
                                                    height={80}
                                                    className="icon"
                                                />
                                            </div>


                                            {/* Track Content - API */}
                                            <div className="track_content">

                                                <h3 className="fsz-22 fw-500 mb-2">
                                                    {track.title}
                                                </h3>

                                                <p className="fsz-16 mb-0">
                                                    {track.coursesCount}{" "}
                                                    {t("courses")}
                                                </p>

                                            </div>

                                        </div>
                                    </Reveal>
                                </div>
                            )
                        )}

                    </div>
                </div>

            </div>


            {/* Background Image - API */}
            <Image
                src='/images/learningTracks-bg.png'
                className="bg"
                alt=""
                fill
            />

        </section>
    );
};

export default LearningTracks;