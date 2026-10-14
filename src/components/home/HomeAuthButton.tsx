import { getTranslations } from "next-intl/server";

import { getAuthToken } from "@/lib/auth/session";
import { Link } from "@/i18n/routing";

type HomeAuthButtonProps = {
    className: string;
    guestLabel: string;
};

const HomeAuthButton = async ({
    className,
    guestLabel,
}: HomeAuthButtonProps) => {
    const token = await getAuthToken();
    const t = await getTranslations("hero");
    const isLoggedIn = Boolean(token);

    return (
        <Link
            href={isLoggedIn ? "/profile" : "/login"}
            className={className}
        >
            <div className="txt">
                {isLoggedIn ? t("exploreCourses") : guestLabel}
            </div>

            <span className="hvr-icon hvr-icon-current">
                <i className="fa-regular fa-arrow-up-right"></i>
            </span>

            <span className="hvr-icon hvr-icon-next">
                <i className="fa-regular fa-arrow-right"></i>
            </span>
        </Link>
    );
};

export default HomeAuthButton;
