import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import ProfileHeader from "@/components/profile/ProfileHeader/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs/ProfileTabs";

import PersonalInformation from "@/components/profile/ProfileContent/PersonalInformation/PersonalInformation";
import MyCourses from "@/components/profile/ProfileContent/MyCourses/MyCourses";

import { getProfileData } from "@/lib/api/profile";
import { getAuthToken } from "@/lib/auth/session";
import { redirect } from "@/i18n/routing";

import { getLocale } from "next-intl/server";

const ProfilePage = async () => {
    const locale = await getLocale();
    const token = await getAuthToken();

    if (!token) {
        redirect({ href: "/login", locale });
    }

    const profile = await getProfileData(locale);

    return (
        <>
            <Navbar />

            <main>
                <section className="profile_pg position-relative pb-70 bg_blue pt-150">
                    <div className="container">

                        <ProfileHeader data={profile} />

                        <ProfileTabs
                            personalContent={
                                <PersonalInformation data={profile} />
                            }
                            coursesContent={
                                <MyCourses locale={locale} />
                            }
                        />

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ProfilePage;
