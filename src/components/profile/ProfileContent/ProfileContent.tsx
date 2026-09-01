"use client";

import { ReactNode } from "react";

type ProfileContentProps = {
    activeTab: "personal" | "courses";
    personalContent: ReactNode;
    coursesContent: ReactNode;
};

const ProfileContent = ({
    activeTab,
    personalContent,
    coursesContent,
}: ProfileContentProps) => {
    return (
        <div className="profile_content">

            {activeTab === "personal" && (
                personalContent
            )}

            {activeTab === "courses" && (
                coursesContent
            )}

        </div>
    );
};

export default ProfileContent;