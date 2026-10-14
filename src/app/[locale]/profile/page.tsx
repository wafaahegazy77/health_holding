import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import ProfileShell from "@/components/profile/ProfileShell";
import MyCourses from "@/components/profile/ProfileContent/MyCourses/MyCourses";
import { getPersonalInformationTranslations } from "@/components/profile/ProfileContent/PersonalInformation/PersonalInformation";

import { getProfileData } from "@/lib/api/profile";
import { ApiRequestError } from "@/lib/api/server";
import { clearAuthToken, getAuthToken } from "@/lib/auth/session";
import { redirect } from "@/i18n/routing";

import { getLocale, getTranslations } from "next-intl/server";

import "@/components/profile/ProfileContent/PersonalInformation/_PersonalInformation.scss";

function isUnauthorizedError(error: ApiRequestError) {
    if (error.status === 401) return true;

    if (/login first/i.test(error.message)) return true;

    if (
        error.errors &&
        typeof error.errors === "object" &&
        !Array.isArray(error.errors) &&
        "status" in error.errors
    ) {
        return Number((error.errors as { status?: number }).status) === 401;
    }

    return false;
}

const ProfilePage = async () => {
    const locale = await getLocale();
    const token = await getAuthToken();

    if (!token) {
        redirect({ href: "/login", locale });
    }

    let profile;

    try {
        profile = await getProfileData(locale);
    } catch (error) {
        if (error instanceof ApiRequestError && isUnauthorizedError(error)) {
            try {
                await clearAuthToken();
            } catch {
                // Cookie may be read-only outside Server Actions.
            }

            redirect({ href: "/login", locale });
        }

        throw error;
    }

    const [personalTranslations, tProfile] = await Promise.all([
        getPersonalInformationTranslations(),
        getTranslations("profile"),
    ]);

    return (
        <>
            <Navbar />

            <main>
                <section className="profile_pg position-relative pb-70 bg_blue pt-150">
                    <div className="container">
                        <ProfileShell
                            initialProfile={profile}
                            personalTranslations={personalTranslations}
                            memberSinceLabel={tProfile("memberSince")}
                            coursesContent={<MyCourses locale={locale} />}
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ProfilePage;
