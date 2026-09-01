"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import LogoutModal from "@/components/profile/Modals/LogoutModal";

import "./_ProfileSidebar.scss";

type ProfileSidebarProps = {
    activeTab: "personal" | "courses";
    onTabChange: (tab: "personal" | "courses") => void;
    coursesCount: number;
};

const ProfileSidebar = ({
    activeTab,
    onTabChange,
    coursesCount,
}: ProfileSidebarProps) => {
    const t = useTranslations("profile.sidebar");

    const [isLogoutOpen, setIsLogoutOpen] =
        useState(false);

    return (
        <>
            <aside className="profile_sidebar">

                {/* Personal Information */}
                <button
                    type="button"
                    className={`sidebar_item ${
                        activeTab === "personal"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        onTabChange("personal")
                    }
                >
                    <i className="fa-regular fa-user" />

                    <span>
                        {t("personalInformation")}
                    </span>
                </button>


                {/* My Courses */}
                <button
                    type="button"
                    className={`sidebar_item ${
                        activeTab === "courses"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        onTabChange("courses")
                    }
                >
                    <i className="fa-regular fa-book-open" />

                    <span>
                        {t("myCourses")}
                    </span>

                    <span className="courses_count">
                        {coursesCount}
                    </span>
                </button>


                {/* Divider */}
                <div className="sidebar_divider" />


                {/* Logout */}
                <button
                    type="button"
                    className="sidebar_item logout"
                    onClick={() =>
                        setIsLogoutOpen(true)
                    }
                >
                    <i className="fa-regular fa-arrow-right-from-bracket" />

                    <span>
                        {t("logout")}
                    </span>
                </button>

            </aside>


            <LogoutModal
                isOpen={isLogoutOpen}
                onClose={() =>
                    setIsLogoutOpen(false)
                }
            />
        </>
    );
};

export default ProfileSidebar;