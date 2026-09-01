"use client";

import {
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { useLenis } from "@/components/LenisProvider";

import "./_Modals.scss";

type LogoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const LogoutModal = ({
    isOpen,
    onClose,
}: LogoutModalProps) => {
    const t = useTranslations("profile.logoutModal");

    const [mounted, setMounted] = useState(false);

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


    if (!mounted || !isOpen) {
        return null;
    }


    return createPortal(
        <div
            className="profile_modal logout_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="profile_modal_box logout_modal_box">

                {/* Header */}
                <div className="profile_modal_header logout_modal_header">

                    <h2 id="logout-modal-title">
                        {t("title")}
                    </h2>

                    <button
                        type="button"
                        className="profile_modal_close logout_modal_close"
                        onClick={onClose}
                        aria-label={t("close")}
                    >
                        <i className="fa-regular fa-xmark" />
                    </button>

                </div>


                {/* Body */}
                <div className="profile_modal_body logout_modal_body">

                    <div className="logout_modal_icon">
                        <i className="fa-regular fa-arrow-right-from-bracket" />
                    </div>

                    <p>
                        {t("description")}
                    </p>

                </div>


                {/* Actions */}
                <div className="profile_modal_actions logout_modal_actions">

                    <button
                        type="button"
                        className="profile_modal_cancel logout_cancel"
                        onClick={onClose}
                    >
                        {t("cancel")}
                    </button>

                    <button
                        type="button"
                        className="logout_confirm"
                    >
                        {t("confirm")}
                    </button>

                </div>

            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;