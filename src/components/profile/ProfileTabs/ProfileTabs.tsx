"use client";

import { ReactNode, useState } from "react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import ProfileSidebar from "@/components/profile/ProfileSidebar/ProfileSidebar";
import ProfileContent from "@/components/profile/ProfileContent/ProfileContent";
import {
    fetchProfileCourses,
    getProfileCoursesQueryKey,
} from "@/lib/api/profile-courses-client";

type ProfileTabsProps = {
    personalContent: ReactNode;
    coursesContent: ReactNode;
};

const ProfileTabs = ({
    personalContent,
    coursesContent,
}: ProfileTabsProps) => {
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<"personal" | "courses">("personal");

    // Unfiltered query for sidebar count (summary ignores list filters on backend).
    const { data } = useQuery({
        queryKey: getProfileCoursesQueryKey({}),
        queryFn: () => fetchProfileCourses(locale, {}),
    });

    const coursesCount = data?.summary.total ?? data?.courses.length ?? 0;

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
