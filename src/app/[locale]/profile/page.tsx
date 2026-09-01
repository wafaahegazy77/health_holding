import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import ProfileHeader from "@/components/profile/ProfileHeader/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs/ProfileTabs";

import PersonalInformation from "@/components/profile/ProfileContent/PersonalInformation/PersonalInformation";
import MyCourses from "@/components/profile/ProfileContent/MyCourses/MyCourses";

import ProfileData from "@/mock-api/profile.json";

import { getLocale } from "next-intl/server";

const ProfilePage = async () => {
    const locale = await getLocale();

    return (
        <>
            <Navbar />

            <main>
                <section className="profile_pg position-relative pb-70 bg_blue pt-100">
                    <div className="container">

                        <ProfileHeader />

                        <ProfileTabs
                            personalContent={
                                <PersonalInformation />
                            }
                            coursesContent={
                                <MyCourses
                                    courses={ProfileData.courses}
                                    locale={locale}
                                />
                            }
                            coursesCount={
                                ProfileData.courses.length
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