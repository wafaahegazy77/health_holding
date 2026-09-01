"use client";

import {
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { useLenis } from "@/components/LenisProvider";

import "./_Modals.scss";

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ChangePasswordModal = ({
    isOpen,
    onClose,
}: ChangePasswordModalProps) => {
    const t = useTranslations(
        "profile.changePasswordModal"
    );

    const [mounted, setMounted] = useState(false);

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const lenis = useLenis();


    // -----------------------------------------
    // Mount
    // -----------------------------------------

    useEffect(() => {
        setMounted(true);
    }, []);


    // -----------------------------------------
    // Scroll Lock
    // -----------------------------------------

    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;

        // Stop Lenis
        lenis?.stop();

        // Lock native scroll
        document.documentElement.style.overflow = "hidden";

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";


        // Escape
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        // Cleanup
        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            // Unlock native scroll
            document.documentElement.style.overflow = "";

            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";

            // Restore exact scroll position
            window.scrollTo(0, scrollY);

            // Start Lenis again
            lenis?.start();
        };
    }, [isOpen, onClose, lenis]);


    // -----------------------------------------
    // Password Visibility
    // -----------------------------------------

    const togglePassword = (
        field:
            | "current"
            | "new"
            | "confirm"
    ) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };


    if (!mounted || !isOpen) {
        return null;
    }


    return createPortal(
        <div
            className="profile_modal change_password_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-modal-title"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="profile_modal_box change_password_modal_box">

                {/* Header */}
                <div className="profile_modal_header change_password_modal_header">

                    <h2 id="change-password-modal-title">
                        {t("title")}
                    </h2>

                    <button
                        type="button"
                        className="profile_modal_close change_password_modal_close"
                        onClick={onClose}
                        aria-label={t("close")}
                    >
                        <i className="fa-regular fa-xmark" />
                    </button>

                </div>


                {/* Body */}
                <div className="profile_modal_body change_password_modal_body">

                    <div className="change_password_form">

                        {/* Current Password */}
                        <div className="form_group change_password_field">

                            <label htmlFor="current-password">
                                {t("currentPassword")}
                            </label>

                            <div className="password_input">

                                <input
                                    id="current-password"
                                    type={
                                        showPasswords.current
                                            ? "text"
                                            : "password"
                                    }
                                    name="currentPassword"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password_toggle"
                                    onClick={() =>
                                        togglePassword(
                                            "current"
                                        )
                                    }
                                    aria-label={
                                        showPasswords.current
                                            ? t("hidePassword")
                                            : t("showPassword")
                                    }
                                >
                                    <i
                                        className={
                                            showPasswords.current
                                                ? "fa-regular fa-eye-slash"
                                                : "fa-regular fa-eye"
                                        }
                                    />
                                </button>

                            </div>

                        </div>


                        {/* New Password */}
                        <div className="form_group change_password_field">

                            <label htmlFor="new-password">
                                {t("newPassword")}
                            </label>

                            <div className="password_input">

                                <input
                                    id="new-password"
                                    type={
                                        showPasswords.new
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password_toggle"
                                    onClick={() =>
                                        togglePassword(
                                            "new"
                                        )
                                    }
                                    aria-label={
                                        showPasswords.new
                                            ? t("hidePassword")
                                            : t("showPassword")
                                    }
                                >
                                    <i
                                        className={
                                            showPasswords.new
                                                ? "fa-regular fa-eye-slash"
                                                : "fa-regular fa-eye"
                                        }
                                    />
                                </button>

                            </div>

                        </div>


                        {/* Confirm New Password */}
                        <div className="form_group change_password_field">

                            <label htmlFor="confirm-new-password">
                                {t("confirmNewPassword")}
                            </label>

                            <div className="password_input">

                                <input
                                    id="confirm-new-password"
                                    type={
                                        showPasswords.confirm
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmNewPassword"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password_toggle"
                                    onClick={() =>
                                        togglePassword(
                                            "confirm"
                                        )
                                    }
                                    aria-label={
                                        showPasswords.confirm
                                            ? t("hidePassword")
                                            : t("showPassword")
                                    }
                                >
                                    <i
                                        className={
                                            showPasswords.confirm
                                                ? "fa-regular fa-eye-slash"
                                                : "fa-regular fa-eye"
                                        }
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Actions */}
                <div className="profile_modal_actions change_password_modal_actions">

                    <button
                        type="button"
                        className="profile_modal_cancel"
                        onClick={onClose}
                    >
                        {t("cancel")}
                    </button>

                    <button
                        type="button"
                        className="change_password_submit"
                    >
                        {t("updatePassword")}
                    </button>

                </div>

            </div>
        </div>,
        document.body
    );
};

export default ChangePasswordModal;