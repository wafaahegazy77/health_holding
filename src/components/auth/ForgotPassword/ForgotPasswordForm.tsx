"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";

import "./_ForgotPassword.scss";

type ForgotPasswordStep = 1 | 2 | 3;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCountdown(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function resolveErrorMessage(
    payload: {
        message?: string;
        errors?: Record<string, string[] | string> | string[] | string;
    } | null,
    fallback: string,
): string {
    if (!payload) return fallback;

    if (typeof payload.errors === "string" && payload.errors.trim()) {
        return payload.errors;
    }

    if (Array.isArray(payload.errors)) {
        const first = payload.errors.find(
            (item) => typeof item === "string" && item.trim(),
        );
        if (first) return first;
    }

    if (payload.errors && typeof payload.errors === "object") {
        for (const value of Object.values(payload.errors)) {
            if (Array.isArray(value) && value[0]) return String(value[0]);
            if (typeof value === "string" && value.trim()) return value;
        }
    }

    if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
    }

    return fallback;
}

const ForgotPasswordForm = () => {
    const t = useTranslations("auth.forgotPassword");
    const locale = useLocale();
    const router = useRouter();

    const [currentStep, setCurrentStep] =
        useState<ForgotPasswordStep>(1);

    const [email, setEmail] = useState("");

    const [verificationCode, setVerificationCode] =
        useState(["", "", "", ""]);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(0);

    useEffect(() => {
        if (resendSeconds <= 0) return;

        const timer = window.setTimeout(() => {
            setResendSeconds((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [resendSeconds]);

    const codeValue = verificationCode.join("");

    const requestCode = async (mode: "send" | "resend") => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError(t("errors.emailRequired"));
            return false;
        }

        if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setError(t("errors.emailInvalid"));
            return false;
        }

        if (mode === "send") setIsRequesting(true);
        else setIsResending(true);

        setError(null);

        try {
            const response = await fetch("/api/auth/forgot-password/request", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    lang: locale,
                }),
            });

            const payload = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                setError(resolveErrorMessage(payload, t("errors.requestFailed")));
                return false;
            }

            setResendSeconds(55);
            return true;
        } catch {
            setError(t("errors.requestFailed"));
            return false;
        } finally {
            if (mode === "send") setIsRequesting(false);
            else setIsResending(false);
        }
    };

    const handleSendCode = async () => {
        if (isRequesting) return;
        const ok = await requestCode("send");
        if (ok) setCurrentStep(2);
    };

    const handleResendCode = async () => {
        if (isResending || resendSeconds > 0 || isVerifying) return;
        await requestCode("resend");
    };

    const handleVerifyCode = async () => {
        if (isVerifying) return;

        if (!/^\d{4}$/.test(codeValue)) {
            setError(t("errors.codeInvalid"));
            return;
        }

        setIsVerifying(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/forgot-password/verify", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    code: codeValue,
                    lang: locale,
                }),
            });

            const payload = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                setError(resolveErrorMessage(payload, t("errors.verifyFailed")));
                return;
            }

            setCurrentStep(3);
        } catch {
            setError(t("errors.verifyFailed"));
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResetPassword = async () => {
        if (isResetting) return;

        if (!newPassword.trim()) {
            setError(t("errors.passwordRequired"));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t("errors.passwordMismatch"));
            return;
        }

        if (!/^\d{4}$/.test(codeValue)) {
            setError(t("errors.codeInvalid"));
            return;
        }

        setIsResetting(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    code: codeValue,
                    password: newPassword,
                    passwordConfirmation: confirmPassword,
                    lang: locale,
                }),
            });

            const payload = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                setError(resolveErrorMessage(payload, t("errors.resetFailed")));
                return;
            }

            setNewPassword("");
            setConfirmPassword("");
            setVerificationCode(["", "", "", ""]);
            router.replace("/login");
            router.refresh();
        } catch {
            setError(t("errors.resetFailed"));
        } finally {
            setIsResetting(false);
        }
    };

    const handleChangeEmail = () => {
        if (isRequesting || isVerifying || isResending) return;
        setError(null);
        setVerificationCode(["", "", "", ""]);
        setCurrentStep(1);
    };

    return (
        <div className="auth_inner forgot_password_form">

            <div className="forgot_password_progress">
                {[1, 2, 3].map((step) => (
                    <span
                        key={step}
                        className={
                            step <= currentStep
                                ? "active"
                                : ""
                        }
                    />
                ))}
            </div>

            <div className="forgot_password_step_number">
                {t("step", {
                    current: currentStep,
                    total: 3,
                })}
            </div>

            {error ? (
                <p className="text-danger mb-3" role="alert" style={{ fontSize: 14 }}>
                    {error}
                </p>
            ) : null}

            {currentStep === 1 && (
                <div className="forgot_password_step_content">

                    <div className="box_header">
                        <h1 className="title">
                            {t("stepOne.title")}
                        </h1>

                        <p className="description">
                            {t("stepOne.description")}
                        </p>
                    </div>

                    <div className="auth_field">
                        <label htmlFor="forgot-email">
                            {t("stepOne.email.label")}
                            <span>*</span>
                        </label>

                        <div className="input_wrapper">
                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder={t(
                                    "stepOne.email.placeholder"
                                )}
                                autoComplete="email"
                                disabled={isRequesting}
                            />
                        </div>

                        <span className="input_hint">
                            {t("stepOne.email.hint")}
                        </span>
                    </div>

                    <div className="forgot_password_actions">

                        <button
                            type="button"
                            className="forgot_password_back"
                            onClick={() =>
                                router.push("/login")
                            }
                            disabled={isRequesting}
                        >
                            {t("stepOne.backToLogin")}
                        </button>

                        <button
                            type="button"
                            className="butn gradient_butn hvr-icon-slide-out-in"
                            onClick={handleSendCode}
                            disabled={isRequesting}
                            aria-busy={isRequesting}
                        >
                            <div className="txt">
                                {isRequesting
                                    ? t("loading.sending")
                                    : t("stepOne.sendCode")}
                            </div>

                            {!isRequesting ? (
                                <>
                                    <span className="hvr-icon hvr-icon-current">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>

                                    <span className="hvr-icon hvr-icon-next">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>
                                </>
                            ) : null}
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="forgot_password_step_content">

                    <div className="box_header">
                        <h1 className="title">
                            {t("stepTwo.title")}
                        </h1>

                        <p className="description">
                            {t("stepTwo.description", {
                                email:
                                    email ||
                                    "example@example.com",
                            })}
                        </p>
                    </div>

                    <div className="forgot_password_otp">

                        {verificationCode.map(
                            (value, index) => (
                                <input
                                    key={index}
                                    id={`forgot-otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={value}
                                    disabled={isVerifying || isResending}
                                    autoComplete={
                                        index === 0
                                            ? "one-time-code"
                                            : "off"
                                    }
                                    onChange={(event) => {
                                        const nextValue =
                                            event.target.value.replace(
                                                /\D/g,
                                                ""
                                            ).slice(-1);

                                        setVerificationCode(
                                            (previous) => {
                                                const next = [
                                                    ...previous,
                                                ];

                                                next[index] =
                                                    nextValue;

                                                return next;
                                            }
                                        );

                                        if (
                                            nextValue &&
                                            index < 3
                                        ) {
                                            document
                                                .querySelector<HTMLInputElement>(
                                                    `#forgot-otp-${index + 1}`
                                                )
                                                ?.focus();
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key ===
                                                "Backspace" &&
                                            !value &&
                                            index > 0
                                        ) {
                                            document
                                                .querySelector<HTMLInputElement>(
                                                    `#forgot-otp-${index - 1}`
                                                )
                                                ?.focus();
                                        }
                                    }}
                                />
                            )
                        )}

                    </div>

                    <div className="forgot_password_resend">
                        {resendSeconds > 0 ? (
                            t("stepTwo.resend", {
                                time: formatCountdown(resendSeconds),
                            })
                        ) : (
                            <button
                                type="button"
                                className="forgot_password_back"
                                onClick={handleResendCode}
                                disabled={isResending || isVerifying}
                            >
                                {isResending
                                    ? t("loading.sending")
                                    : t("stepTwo.resendNow")}
                            </button>
                        )}
                    </div>

                    <div className="forgot_password_actions">

                        <button
                            type="button"
                            className="forgot_password_back"
                            onClick={handleChangeEmail}
                            disabled={isVerifying || isResending}
                        >
                            {t("stepTwo.changeEmail")}
                        </button>

                        <button
                            type="button"
                            className="butn gradient_butn hvr-icon-slide-out-in"
                            onClick={handleVerifyCode}
                            disabled={isVerifying || isResending}
                            aria-busy={isVerifying}
                        >
                            <div className="txt">
                                {isVerifying
                                    ? t("loading.verifying")
                                    : t("stepTwo.verify")}
                            </div>

                            {!isVerifying ? (
                                <>
                                    <span className="hvr-icon hvr-icon-current">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>

                                    <span className="hvr-icon hvr-icon-next">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>
                                </>
                            ) : null}
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="forgot_password_step_content">

                    <div className="box_header">
                        <h1 className="title">
                            {t("stepThree.title")}
                        </h1>

                        <p className="description">
                            {t("stepThree.description")}
                        </p>
                    </div>

                    <div className="row">

                        <div className="col-lg-6">
                            <div className="auth_field">

                                <label htmlFor="new-password">
                                    {t(
                                        "stepThree.newPassword.label"
                                    )}
                                    <span>*</span>
                                </label>

                                <div className="password_field">

                                    <input
                                        id="new-password"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="•••"
                                        autoComplete="new-password"
                                        disabled={isResetting}
                                    />

                                    <button
                                        type="button"
                                        className="password_toggle"
                                        onClick={() =>
                                            setShowNewPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showNewPassword
                                                ? t("hidePassword")
                                                : t("showPassword")
                                        }
                                        disabled={isResetting}
                                    >
                                        <i
                                            className={
                                                showNewPassword
                                                    ? "fa-regular fa-eye-slash"
                                                    : "fa-regular fa-eye"
                                            }
                                        />
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="auth_field">

                                <label htmlFor="confirm-password">
                                    {t(
                                        "stepThree.confirmPassword.label"
                                    )}
                                    <span>*</span>
                                </label>

                                <div className="password_field">

                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="•••"
                                        autoComplete="new-password"
                                        disabled={isResetting}
                                    />

                                    <button
                                        type="button"
                                        className="password_toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? t("hidePassword")
                                                : t("showPassword")
                                        }
                                        disabled={isResetting}
                                    >
                                        <i
                                            className={
                                                showConfirmPassword
                                                    ? "fa-regular fa-eye-slash"
                                                    : "fa-regular fa-eye"
                                            }
                                        />
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="forgot_password_actions forgot_password_actions_end">

                        <button
                            type="button"
                            className="butn gradient_butn hvr-icon-slide-out-in"
                            onClick={handleResetPassword}
                            disabled={isResetting}
                            aria-busy={isResetting}
                        >
                            <div className="txt">
                                {isResetting
                                    ? t("loading.resetting")
                                    : t("stepThree.resetPassword")}
                            </div>

                            {!isResetting ? (
                                <>
                                    <span className="hvr-icon hvr-icon-current">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>

                                    <span className="hvr-icon hvr-icon-next">
                                        <i className="fa-regular fa-arrow-right" />
                                    </span>
                                </>
                            ) : null}
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ForgotPasswordForm;
