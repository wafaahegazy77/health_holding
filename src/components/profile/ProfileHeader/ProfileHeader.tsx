import { getTranslations } from "next-intl/server";
import { getProfileData } from "@/lib/api/profile";
import "./_ProfileHeader.scss";

const ProfileHeader = async () => {
    const t = await getTranslations("profile");

    const data = await getProfileData();

    return (
        <div className="profile_header bg_gradient">

            <h1 className="profile_name fsz-30">
                Dr. {data.firstName} {data.lastName}
            </h1>

            <p className="profile_email text-white fsz-18 py-2">
                {data.email}
            </p>

            <div className="profile_meta">
                <span>{data.country}</span>
                <span>{data.region}</span>
                <span>
                    {t("memberSince")} {data.memberSince}
                </span>
            </div>

        </div>
    );
};

export default ProfileHeader;