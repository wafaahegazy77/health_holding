"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const LoginForm = () => {
    const t = useTranslations("auth.login");

    const [showPassword, setShowPassword] =
        useState(false);

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
            <form>

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
                >
                    <span className="txt" data-text= {t("submit")}>
                        <span> {t("submit")}</span>
                    </span>

                    <i className="fa-regular fa-arrow-right ms-2" />
                </button>
            </form>

            {/* Register */}
            <div className="login_register">
                <span>
                    {t("noAccount")}
                </span>

                <Link href="/register">
                    {t("signUp")}
                </Link>
            </div>

        </div>
    );
};

export default LoginForm;