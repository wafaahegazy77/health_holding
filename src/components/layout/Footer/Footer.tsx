import { getLocale, getTranslations } from "next-intl/server";

import { getHomeData } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import Reveal from "@/components/animations/Reveal";
import BackToTop from "./BackToTop";

import "./_Footer.scss";

const Footer = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");

    const data = await getHomeData(locale);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">

            <div className="container">

                {/* Top Content */}
                <div className="footer_top">
                    <div className="row justify-content-between">

                        {/* Brand */}
                        <div className="col-lg-5 col-md-12">
                            <div className="footer_brand">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <Link
                                        href="/"
                                        className="footer_logo"
                                    >
                                        <img
                                            src="/images/logo.png"
                                            alt="Health Holding"
                                        />
                                    </Link>
                                </Reveal>

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <p className="footer_description fsz-18 mb-0 col-lg-10">
                                        {data.footer.description}
                                    </p>
                                </Reveal>

                            </div>
                        </div>


                        {/* Contact */}
                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h3 className="fsz-22 fw-500">
                                        {t("contact")}
                                    </h3>
                                </Reveal>

                                <ul>

                                    <li>
                                        <a
                                            href={`mailto:${data.footer.email}`}
                                        >
                                            {data.footer.email}
                                        </a>
                                    </li>

                                    <li>
                                        <span>
                                            {data.footer.location}
                                        </span>
                                    </li>

                                </ul>

                            </div>
                        </div>


                        {/* Platform */}
                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h3 className="fsz-18 fw-500">
                                        {t("platform")}
                                    </h3>
                                </Reveal>

                                <ul>

                                    <li>
                                        <Link href="/about">
                                            {t("aboutUs")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/learning-tracks">
                                            {t("learningTracks")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/courses">
                                            {t("courses")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/faqs">
                                            {t("faqs")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/contact">
                                            {t("contactLink")}
                                        </Link>
                                    </li>

                                </ul>

                            </div>
                        </div>


                        {/* Helps */}
                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">

                                <Reveal
                                    animation="fade-up"
                                    trigger="load"
                                >
                                    <h3 className="fsz-18 fw-500">
                                        {t("helps")}
                                    </h3>
                                </Reveal>

                                <ul>

                                    <li>
                                        <Link href="/privacy-policy">
                                            {t("privacyPolicy")}
                                        </Link>
                                    </li>

                                    <li>
                                        <Link href="/terms-conditions">
                                            {t("termsConditions")}
                                        </Link>
                                    </li>

                                </ul>

                            </div>
                        </div>

                    </div>
                </div>


                {/* Bottom */}
                <div className="footer_bottom">

                    {/* Copyright */}
                    <div className="copyright fsz-15">
                        © {currentYear} {t("copyright")}
                    </div>


                    {/* Social Links */}
                    <div className="social_links">

                        <a
                            href="#"
                            aria-label="X"
                        >
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>

                        <a
                            href="#"
                            aria-label="Facebook"
                        >
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>

                        <a
                            href="#"
                            aria-label="Instagram"
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </a>

                        <a
                            href="#"
                            aria-label="LinkedIn"
                        >
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>

                        <a
                            href="#"
                            aria-label="YouTube"
                        >
                            <i className="fa-brands fa-youtube"></i>
                        </a>

                    </div>


                    {/* Back To Top */}
                    <BackToTop
                        label={t("backToTop")}
                    />

                </div>

            </div>

        </footer>
    );
};

export default Footer;