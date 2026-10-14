"use client";

import type { ProfileData } from "@/lib/api/profile";
import "./_ProfileHeader.scss";

type Props = {
    data: ProfileData;
    memberSinceLabel: string;
};

function formatSalutation(salutation: string) {
    const value = salutation.trim();
    if (!value) return "";
    const normalized = value.replace(/\.$/, "");
    return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1).toLowerCase()}.`;
}

const ProfileHeader = ({ data, memberSinceLabel }: Props) => {
    const salutation = formatSalutation(data.salutation);
    const fullName = [salutation, data.firstName, data.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="profile_header bg_gradient">
            <h1 className="profile_name fsz-30">{fullName}</h1>

            <p className="profile_email text-white fsz-18 py-2">
                {data.email}
            </p>

            <div className="profile_meta">
                {data.healthCluster || data.region ? (
                    <span>{data.healthCluster || data.region}</span>
                ) : null}
                {data.memberSince ? (
                    <span>
                        {memberSinceLabel} {data.memberSince}
                    </span>
                ) : null}
            </div>
        </div>
    );
};

export default ProfileHeader;
