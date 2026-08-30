"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useState } from "react";
import "./_Navbar.scss";

const navItems = [
    {
        key: "about",
        href: "/about",
    },
    {
        key: "tracks",
        href: "/tracks",
    },
    {
        key: "courses",
        href: "/courses",
    },
    {
        key: "platformFeatures",
        href: "/#platform-features",
    },
    {
        key: "process",
        href: "/#process",
    },
    {
        key: "faqs",
        href: "/#faqs",
    },
];

export default function Navbar() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("navbar");

    const [languageOpen, setLanguageOpen] = useState(false);

    const changeLanguage = (nextLocale: "en" | "ar") => {
        if (nextLocale === locale) {
            setLanguageOpen(false);
            return;
        }

        router.replace(pathname, { locale: nextLocale });
        setLanguageOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg homeNav">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" href="/">
                    <Image
                        src="/images/logo.png"
                        alt="Health Holding"
                        className="logo"
                        width={100}
                        height={50}
                        priority
                    />
                </Link>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav  mb-2 mb-lg-0">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.key}>
                                <Link
                                    className="nav-link"
                                    href={item.href}
                                >
                                    {t(item.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side */}
                    <div className="nav-side">
                        {/* Language Dropdown */}
                        <div className="language-dropdown d-none">
                            <button
                                type="button"
                                className="language-trigger"
                                aria-expanded={languageOpen}
                                aria-haspopup="true"
                                onClick={() =>
                                    setLanguageOpen((prev) => !prev)
                                }
                            >
                                <i className="fa-regular fa-globe"></i>

                                <span>
                                    {locale === "ar" ? "عربي" : "English"}
                                </span>

                                <i
                                    className={`fa-regular fa-chevron-down ${
                                        languageOpen ? "rotate" : ""
                                    }`}
                                ></i>
                            </button>

                            {languageOpen && (
                                <div className="language-menu">
                                    <button
                                        type="button"
                                        className={
                                            locale === "en"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            changeLanguage("en")
                                        }
                                    >
                                        English
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            locale === "ar"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            changeLanguage("ar")
                                        }
                                    >
                                        عربي
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Explore Content */}
                            <Link
                                href="/"
                                className="butn white_butn hvr-icon-slide-out-in"
                            >
                                <div className="txt" >
                                    {t("exploreContent")}
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

                    </div>
                </div>
            </div>
        </nav>
    );
}