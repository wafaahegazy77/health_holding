"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";

import { useLenis } from "@/components/LenisProvider";

import "./_Modals.scss";

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const emptyForm = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

const ChangePasswordModal = ({
    isOpen,
    onClose,
}: ChangePasswordModalProps) => {
    const t = useTranslations(
        "profile.changePasswordModal"
    );
    const locale = useLocale();

    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);

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
    // Reset when closed
    // -----------------------------------------

    useEffect(() => {
        if (isOpen) return;

        setForm(emptyForm);
        setError(null);
        setSuccess(null);
        setIsSubmitting(false);
        setShowPasswords({
            current: false,
            new: false,
            confirm: false,
        });
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
            if (event.key === "Escape" && !isSubmitting) {
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
    }, [isOpen, onClose, lenis, isSubmitting]);


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

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resolveApiError = (result: {
        message?: string;
        errors?: Record<string, string[] | string> | string[] | string;
    } | null) => {
        if (!result) return t("errorGeneric");

        if (typeof result.errors === "string" && result.errors.trim()) {
            return result.errors;
        }

        if (Array.isArray(result.errors)) {
            const first = result.errors.find(
                (item) => typeof item === "string" && item.trim(),
            );
            if (first) return first;
        }

        if (result.errors && typeof result.errors === "object") {
            for (const value of Object.values(result.errors)) {
                if (Array.isArray(value) && value[0]) return String(value[0]);
                if (typeof value === "string" && value.trim()) return value;
            }
        }

        if (typeof result.message === "string" && result.message.trim()) {
            return result.message;
        }

        return t("errorGeneric");
    };

    const handleSubmit = async (event?: FormEvent) => {
        event?.preventDefault();
        if (isSubmitting || success) return;

        setError(null);

        const currentPassword = form.currentPassword.trim();
        const password = form.newPassword;
        const passwordConfirmation = form.confirmNewPassword;

        if (!currentPassword || !password || !passwordConfirmation) {
            setError(t("required"));
            return;
        }

        if (password !== passwordConfirmation) {
            setError(t("mismatch"));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/profile/password", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lang: locale,
                    currentPassword,
                    password,
                    passwordConfirmation,
                }),
            });

            const result = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                setError(resolveApiError(result));
                return;
            }

            setForm(emptyForm);
            setSuccess(t("success"));

            window.setTimeout(() => {
                onClose();
            }, 1000);
        } catch {
            setError(t("errorGeneric"));
        } finally {
            setIsSubmitting(false);
        }
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
                    handleClose();
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
                        onClick={handleClose}
                        aria-label={t("close")}
                        disabled={isSubmitting}
                    >
                        <i className="fa-regular fa-xmark" />
                    </button>

                </div>


                {/* Body */}
                <div className="profile_modal_body change_password_modal_body">

                    <form
                        className="change_password_form"
                        onSubmit={handleSubmit}
                    >

                        {error ? (
                            <p className="text-danger mb-3" role="alert" style={{ fontSize: 14 }}>
                                {error}
                            </p>
                        ) : null}

                        {success ? (
                            <p className="text-success mb-3" role="status" style={{ fontSize: 14 }}>
                                {success}
                            </p>
                        ) : null}

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
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    disabled={isSubmitting || Boolean(success)}
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
                                    disabled={isSubmitting}
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
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    disabled={isSubmitting || Boolean(success)}
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
                                    disabled={isSubmitting}
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
                                    value={form.confirmNewPassword}
                                    onChange={handleChange}
                                    disabled={isSubmitting || Boolean(success)}
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
                                    disabled={isSubmitting}
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

                    </form>

                </div>


                {/* Actions */}
                <div className="profile_modal_actions change_password_modal_actions">

                    <button
                        type="button"
                        className="profile_modal_cancel"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        {t("cancel")}
                    </button>

                    <button
                        type="button"
                        className="change_password_submit"
                        onClick={() => handleSubmit()}
                        disabled={isSubmitting || Boolean(success)}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? t("updating") : t("updatePassword")}
                    </button>

                </div>

            </div>
        </div>,
        document.body
    );
};

export default ChangePasswordModal;
