"use client";

import {
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";
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
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lenis = useLenis();


    // -----------------------------------------
    // Mount
    // -----------------------------------------

    useEffect(() => {
        setMounted(true);
    }, []);


    // -----------------------------------------
    // Reset when closed
    // -----------------------------------------

    useEffect(() => {
        if (isOpen) return;
        setError(null);
        setIsLoggingOut(false);
    }, [isOpen]);


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
            if (event.key === "Escape" && !isLoggingOut) {
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
    }, [isOpen, onClose, lenis, isLoggingOut]);

    const handleClose = () => {
        if (isLoggingOut) return;
        onClose();
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { Accept: "application/json" },
            });

            const payload = (await response.json().catch(() => null)) as {
                message?: string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                setError(payload?.message || t("error"));
                return;
            }

            onClose();
            router.replace("/login");
            router.refresh();
        } catch {
            setError(t("error"));
        } finally {
            setIsLoggingOut(false);
        }
    };


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
                    handleClose();
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
                        onClick={handleClose}
                        aria-label={t("close")}
                        disabled={isLoggingOut}
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

                    {error ? (
                        <p className="text-danger mb-0 mt-3" role="alert" style={{ fontSize: 14 }}>
                            {error}
                        </p>
                    ) : null}

                </div>


                {/* Actions */}
                <div className="profile_modal_actions logout_modal_actions">

                    <button
                        type="button"
                        className="profile_modal_cancel logout_cancel"
                        onClick={handleClose}
                        disabled={isLoggingOut}
                    >
                        {t("cancel")}
                    </button>

                    <button
                        type="button"
                        className="logout_confirm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        aria-busy={isLoggingOut}
                    >
                        {isLoggingOut ? t("loggingOut") : t("confirm")}
                    </button>

                </div>

            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
