import { getLocale, getTranslations } from "next-intl/server";

import { getFooterSection } from "@/lib/api/home";
import { Link } from "@/i18n/routing";
import BackToTop from "./BackToTop";

import "./_Footer.scss";

const Footer = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");
    const footer = await getFooterSection(locale);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">

                <div className="footer_top">
                    <div className="row justify-content-between">

                        <div className="col-lg-5 col-md-12">
                            <div className="footer_brand">
                                <Link href="/" className="footer_logo">
                                    <img src="/images/logo.png" alt="Health Holding" />
                                </Link>

                                {footer.description && (
                                    <p className="footer_description fsz-18 mb-0 col-lg-10">
                                        {footer.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">
                                <h3 className="fsz-22 fw-500">{t("contact")}</h3>

                                <ul>
                                    {footer.email && (
                                        <li>
                                            <a href={`mailto:${footer.email}`}>
                                                <i className="fal fa-envelope me-3"></i>
                                                {footer.email}
                                            </a>
                                        </li>
                                    )}

                                    {footer.phone && (
                                        <li>
                                            <a href={`tel:${footer.phone.replace(/\s/g, "")}`}>
                                                <i className="fal fa-phone me-3"></i>
                                                {footer.phone}
                                            </a>
                                        </li>
                                    )}

                                    {footer.address && (
                                        <li>
                                            <span>
                                                <i className="fal fa-location-dot me-3"></i>
                                                {footer.address}
                                                </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">
                                <h3 className="fsz-18 fw-500">{t("platform")}</h3>

                                <ul>
                                    <li>
                                        <Link href="/about">{t("aboutUs")}</Link>
                                    </li>
                                    <li>
                                        <Link href="/learning-tracks">{t("learningTracks")}</Link>
                                    </li>
                                    <li>
                                        <Link href="/courses">{t("courses")}</Link>
                                    </li>
                                    <li>
                                        <Link href="/faqs">{t("faqs")}</Link>
                                    </li>
                                    <li>
                                        <Link href="/contact">{t("contactLink")}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4">
                            <div className="footer_column">
                                <h3 className="fsz-18 fw-500">{t("helps")}</h3>

                                <ul>
                                    <li>
                                        <Link href="/privacy-policy">{t("privacyPolicy")}</Link>
                                    </li>
                                    <li>
                                        <Link href="/terms-conditions">{t("termsConditions")}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="footer_bottom">
                    <div className="copyright fsz-15">
                        © {currentYear} {t("copyright")}
                    </div>

                    <div className="social_links">
                        {footer.facebook && (
                            <a href={footer.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                        )}

                        {footer.instagram && (
                            <a href={footer.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        )}

                        {footer.x && (
                            <a href={footer.x} target="_blank" rel="noreferrer" aria-label="X">
                                <i className="fa-brands fa-x-twitter"></i>
                            </a>
                        )}

                        {footer.whatsapp && (
                            <a href={footer.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                        )}

                        {footer.linkedin && (
                            <a href={footer.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                        )}
                    </div>

                    <BackToTop label={t("backToTop")} />
                </div>

            </div>
        </footer>
    );
};

export default Footer;
