"use client";

import { ReactNode, useState } from "react";

import ProfileSidebar from "@/components/profile/ProfileSidebar/ProfileSidebar";
import ProfileContent from "@/components/profile/ProfileContent/ProfileContent";

type ProfileTabsProps = {
    personalContent: ReactNode;
    coursesContent: ReactNode;
    coursesCount: number;
};

const ProfileTabs = ({
    personalContent,
    coursesContent,
    coursesCount,
}: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<
        "personal" | "courses"
    >("personal");

    return (
        <div className="row">

            <div className="col-md-3">
                <ProfileSidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    coursesCount={coursesCount}
                />
            </div>

            <div className="col-md-9">
                <ProfileContent
                    activeTab={activeTab}
                    personalContent={personalContent}
                    coursesContent={coursesContent}
                />
            </div>

        </div>
    );
};

export default ProfileTabs;