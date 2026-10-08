"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const LoginForm = () => {
    const t = useTranslations("auth.login");
    const locale = useLocale();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isLoading) return;

        setError(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");
        const remember_me = formData.get("remember") === "on";

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    remember_me,
                    lang: locale,
                }),
            });

            const data = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                success?: boolean;
            } | null;

            if (!response.ok) {
                const resolveErrorMessage = () => {
                    if (typeof data?.message === "string" && data.message.trim()) {
                        return data.message;
                    }

                    const errors = data?.errors;

                    if (typeof errors === "string" && errors.trim()) {
                        return errors;
                    }

                    if (Array.isArray(errors)) {
                        const first = errors.find(
                            (item) => typeof item === "string" && item.trim(),
                        );
                        if (first) return first;
                    }

                    if (errors && typeof errors === "object") {
                        for (const value of Object.values(errors)) {
                            if (Array.isArray(value) && value[0]) return String(value[0]);
                            if (typeof value === "string" && value.trim()) return value;
                        }
                    }

                    return t("errors.generic");
                };

                setError(resolveErrorMessage());
                return;
            }

            router.push("/profile");
            router.refresh();
        } catch {
            setError(t("errors.network"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth_inner">

            {/* Header */}
            <div className="box_header">
                <h1 className="title">
                    {t("title")}
                </h1>

                <p className="description">
                    {t("description")}
                </p>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit}>

                {error ? (
                    <p className="text-danger mb-3" role="alert" style={{ fontSize: 14 }}>
                        {error}
                    </p>
                ) : null}

                {/* E-mail */}
                <div className="auth_field">
                    <label htmlFor="login-email">
                        {t("email.label")}
                    </label>

                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder={t(
                            "email.placeholder"
                        )}
                        autoComplete="email"
                        required
                        disabled={isLoading}
                    />
                </div>


                {/* Password */}
                <div className="auth_field">

                    <label htmlFor="login-password">
                        {t("password.label")}
                    </label>

                    <div className="password_field">

                        <input
                            id="login-password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder={t(
                                "password.placeholder"
                            )}
                            autoComplete="current-password"
                            required
                            disabled={isLoading}
                        />

                        <button
                            type="button"
                            className="password_toggle"
                            aria-label={
                                showPassword
                                    ? t(
                                          "password.hidePassword"
                                      )
                                    : t(
                                          "password.showPassword"
                                      )
                            }
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            disabled={isLoading}
                        >
                            <i
                                className={
                                    showPassword
                                        ? "fa-regular fa-eye-slash"
                                        : "fa-regular fa-eye"
                                }
                            />
                        </button>

                    </div>
                </div>


                {/* Remember Me / Forgot Password */}
                <div className="login_options">

                    <label className="remember_me">
                        <input
                            type="checkbox"
                            name="remember"
                            disabled={isLoading}
                        />

                        <span>
                            {t("rememberMe")}
                        </span>
                    </label>


                    <Link
                        href="/forgot-password"
                        className="forgot_password"
                    >
                        {t("forgotPassword")}
                    </Link>

                </div>


                {/* Submit */}
                <button
                    type="submit"
                    className="butn primary_butn hvr-txt-trans w-100 radius-20 th-60 "
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    <span className="txt" data-text={isLoading ? t("submitting") : t("submit")}>
                        <span>{isLoading ? t("submitting") : t("submit")}</span>
                    </span>

                    {!isLoading ? (
                        <i className="fa-regular fa-arrow-right ms-2" />
                    ) : null}
                </button>
            </form>

            {/* Register */}
            {/* <div className="login_register">
                <span>
                    {t("noAccount")}
                </span>

                <Link href="/register">
                    {t("signUp")}
                </Link>
            </div> */}

        </div>
    );
};

export default LoginForm;
