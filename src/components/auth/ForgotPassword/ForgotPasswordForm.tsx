"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import "./_ForgotPassword.scss";

type ForgotPasswordStep = 1 | 2 | 3;

const ForgotPasswordForm = () => {
    const t = useTranslations("auth.forgotPassword");

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

    const handleSendCode = () => {
        setCurrentStep(2);
    };

    const handleVerifyCode = () => {
        setCurrentStep(3);
    };

    const handleResetPassword = () => {
        console.log({
            email,
            verificationCode,
            newPassword,
            confirmPassword,
        });
    };

    const handleChangeEmail = () => {
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
                                window.history.back()
                            }
                        >
                            {t("stepOne.backToLogin")}
                        </button>

                        <button
                            type="button"
                            className="butn gradient_butn hvr-icon-slide-out-in"
                            onClick={handleSendCode}
                        >
                            <div className="txt">
                                {t("stepOne.sendCode")}
                            </div>

                            <span className="hvr-icon hvr-icon-current">
                                <i className="fa-regular fa-arrow-right" />
                            </span>

                            <span className="hvr-icon hvr-icon-next">
                                <i className="fa-regular fa-arrow-right" />
                            </span>
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
                                            );

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

                    <p className="forgot_password_prototype">
                        {t("stepTwo.prototype")}
                    </p>

                    <div className="forgot_password_resend">
                        {t("stepTwo.resend", {
                            time: "00:55",
                        })}
                    </div>

                    <div className="forgot_password_actions">

                        <button
                            type="button"
                            className="forgot_password_back"
                            onClick={handleChangeEmail}
                        >
                            {t("stepTwo.changeEmail")}
                        </button>

                        <button
                            type="button"
                            className="butn gradient_butn hvr-icon-slide-out-in"
                            onClick={handleVerifyCode}
                        >
                            <div className="txt">
                                {t("stepTwo.verify")}
                            </div>

                            <span className="hvr-icon hvr-icon-current">
                                <i className="fa-regular fa-arrow-right" />
                            </span>

                            <span className="hvr-icon hvr-icon-next">
                                <i className="fa-regular fa-arrow-right" />
                            </span>
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
                        >
                            <div className="txt">
                                {t(
                                    "stepThree.resetPassword"
                                )}
                            </div>

                            <span className="hvr-icon hvr-icon-current">
                                <i className="fa-regular fa-arrow-right" />
                            </span>

                            <span className="hvr-icon hvr-icon-next">
                                <i className="fa-regular fa-arrow-right" />
                            </span>
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ForgotPasswordForm;