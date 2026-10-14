"use client";

import { useTranslations } from "next-intl";
import BrandLogo from "@/components/BrandLogo";
import { Link } from "@/i18n/routing";

import "./_AuthNavbar.scss";

const AuthNavbar = () => {
    const t = useTranslations("auth");

    return (
        <nav className="auth_navbar">
            <div className="container">

                {/* Logo */}
                <Link
                    href="/"
                    className="auth_navbar_logo"
                >
                    <BrandLogo
                        width={170}
                        height={50}
                        priority
                    />
                </Link>


                {/* Back To Site */}
                <Link
                    href="/"
                    className="auth_navbar_back"
                >
                    <i className="fa-regular fa-arrow-left"></i>
                    <span>
                        {t("backToSite")}
                    </span>

                    
                </Link>

            </div>
        </nav>
    );
};

export default AuthNavbar;