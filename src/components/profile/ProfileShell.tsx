"use client";

import { ReactNode, useState } from "react";

import type { ProfileData } from "@/lib/api/profile";
import ProfileHeader from "@/components/profile/ProfileHeader/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs/ProfileTabs";
import PersonalInformationEdit from "@/components/profile/ProfileContent/PersonalInformation/PersonalInformationEdit";

type PersonalInformationTranslations = React.ComponentProps<
    typeof PersonalInformationEdit
>["translations"];

type ProfileShellProps = {
    initialProfile: ProfileData;
    personalTranslations: PersonalInformationTranslations;
    memberSinceLabel: string;
    coursesContent: ReactNode;
};

const ProfileShell = ({
    initialProfile,
    personalTranslations,
    memberSinceLabel,
    coursesContent,
}: ProfileShellProps) => {
    const [profile, setProfile] = useState(initialProfile);

    return (
        <>
            <ProfileHeader
                data={profile}
                memberSinceLabel={memberSinceLabel}
            />

            <ProfileTabs
                personalContent={
                    <PersonalInformationEdit
                        data={profile}
                        translations={personalTranslations}
                        onProfileUpdated={setProfile}
                    />
                }
                coursesContent={coursesContent}
            />
        </>
    );
};

export default ProfileShell;
