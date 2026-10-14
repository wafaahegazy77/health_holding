"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import BrandLogo from "@/components/BrandLogo";
import {
    Link,
    usePathname,
    useRouter,
} from "@/i18n/routing";

import "./_Navbar.scss";

const navItems = [
    {
        key: "about",
        href: "#about",
        sectionId: "about",
    },
    {
        key: "ceoMessage",
        href: "#ceo-message",
        sectionId: "ceo-message",
    },
    {
        key: "headOfTrainingMessage",
        href: "#head-training-message",
        sectionId: "head-training-message",
    },
    {
        key: "process",
        href: "#process",
        sectionId: "process",
    },
    {
        key: "faqs",
        href: "#faqs",
        sectionId: "faqs",
    },
];

type NavbarProps = {
    isLoggedIn?: boolean;
};

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const t = useTranslations("navbar");

    const [languageOpen, setLanguageOpen] =
        useState(false);

    const [accountOpen, setAccountOpen] =
        useState(false);

    const [isScrolled, setIsScrolled] =
        useState(false);

    const [activeSection, setActiveSection] =
        useState("");

    /*
     * -------------------------------------------
     * Home Page
     * -------------------------------------------
     */

    const isHomePage = pathname === "/";

    /*
     * -------------------------------------------
     * Sticky Navbar
     * -------------------------------------------
     */

    useEffect(() => {
        if (!isHomePage) {
            setIsScrolled(false);
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [isHomePage]);

    /*
     * -------------------------------------------
     * Active Section
     * -------------------------------------------
     */

    useEffect(() => {
        if (!isHomePage) {
            setActiveSection("");
            return;
        }

        const sections = navItems
            .map((item) =>
                document.getElementById(
                    item.sectionId
                )
            )
            .filter(Boolean) as HTMLElement[];

        if (!sections.length) return;

        const observer =
            new IntersectionObserver(
                (entries) => {
                    const visibleSections =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (visibleSections.length) {
                        setActiveSection(
                            visibleSections[0].target.id
                        );

                        return;
                    }

                    /*
                     * We're above the first section,
                     * so we're back in the Hero.
                     */

                    const firstSection =
                        sections[0];

                    if (
                        window.scrollY <
                        firstSection.offsetTop - 150
                    ) {
                        setActiveSection("");
                    }
                },
                {
                    root: null,
                    rootMargin:
                        "-20% 0px -55% 0px",
                    threshold: [
                        0.1,
                        0.25,
                        0.5,
                    ],
                }
            );

        sections.forEach((section) =>
            observer.observe(section)
        );

        /*
         * Handle initial position /
         * returning to Hero.
         */

        const handleScroll = () => {
            const firstSection =
                sections[0];

            if (
                window.scrollY <
                firstSection.offsetTop - 150
            ) {
                setActiveSection("");
            }
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            observer.disconnect();

            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [isHomePage]);

    /*
     * -------------------------------------------
     * Language
     * -------------------------------------------
     */

    const changeLanguage = (
        nextLocale: "en" | "ar"
    ) => {
        if (nextLocale === locale) {
            setLanguageOpen(false);
            return;
        }

        router.replace(
            window.location.pathname,
            {
                locale: nextLocale,
            }
        );

        setLanguageOpen(false);
    };

    /*
     * -------------------------------------------
     * Section Navigation
     * -------------------------------------------
     */

    const handleSectionNavigation = (
        sectionId: string
    ) => {
        if (isHomePage) {
            return;
        }

        router.push(
            `/#${sectionId}`
        );
    };

    return (
        <nav
            className={`navbar navbar-expand-lg ${
                isHomePage ? "homeNav" : ""
            } ${
                isHomePage && isScrolled
                    ? "scrolled"
                    : ""
            }`}
        >
            <div className="container">

                {/* Logo */}
                <Link
                    className="navbar-brand"
                    href="/"
                >
                    <BrandLogo
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
                    <ul className="navbar-nav mb-2 mb-lg-0">

                        {navItems.map((item) => (
                            <li
                                className="nav-item"
                                key={item.key}
                            >
                                {isHomePage ? (
                                    <Link
                                        className={`nav-link ${
                                            activeSection ===
                                            item.sectionId
                                                ? "active"
                                                : ""
                                        }`}
                                        href={item.href}
                                    >
                                        {t(item.key)}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className="nav-link"
                                        onClick={() =>
                                            handleSectionNavigation(
                                                item.sectionId
                                            )
                                        }
                                    >
                                        {t(item.key)}
                                    </button>
                                )}
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
                                aria-expanded={
                                    languageOpen
                                }
                                aria-haspopup="true"
                                onClick={() =>
                                    setLanguageOpen(
                                        (prev) =>
                                            !prev
                                    )
                                }
                            >
                                <i className="fa-regular fa-globe"></i>

                                <span>
                                    {locale === "ar"
                                        ? "عربي"
                                        : "English"}
                                </span>

                                <i
                                    className={`fa-regular fa-chevron-down ${
                                        languageOpen
                                            ? "rotate"
                                            : ""
                                    }`}
                                ></i>
                            </button>

                            {languageOpen && (
                                <div className="language-menu">

                                    <button
                                        type="button"
                                        className={
                                            locale ===
                                            "en"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            changeLanguage(
                                                "en"
                                            )
                                        }
                                    >
                                        English
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            locale ===
                                            "ar"
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            changeLanguage(
                                                "ar"
                                            )
                                        }
                                    >
                                        عربي
                                    </button>

                                </div>
                            )}

                        </div>

                        {/* Account Dropdown */}
                        <div className="account-dropdown">

                            <Link 
                                href={isLoggedIn ? "/profile" : "/login"}
                                className="butn white_butn hvr-icon-slide-out-in account-trigger"
                            >
                                <div className="txt">
                                    {isLoggedIn ? t("exploreContent") : t("login")}
                                </div>

                                {/* Current icon */}
                                <span className="hvr-icon hvr-icon-current">
                                    <i className="fa-regular fa-arrow-up-right"></i>
                                </span>

                                {/* Next icon */}
                                <span className="hvr-icon hvr-icon-next">
                                    <i className={`fa-regular ${
                                        isLoggedIn
                                            ? "fa-arrow-right"
                                            : "fa-right-to-bracket"
                                    }`}></i>
                                </span>
                            </Link>


                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
}