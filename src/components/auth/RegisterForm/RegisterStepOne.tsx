"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface RegisterStepOneProps {
    onNext: () => void;
}

const RegisterStepOne = ({
    onNext,
}: RegisterStepOneProps) => {
    const t = useTranslations("auth.register");

    return (
        <div className="register_step_one">

            {/* Country / Salutation */}
            <div className="row">

                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="country">
                            {t("country.label")} <span className="color_secondary">*</span>
                        </label>

                        <select
                            className="form-select"
                            id="country"
                            name="country"
                            defaultValue="Saudi Arabia"
                        >
                            <option value="Saudi Arabia">
                                Saudi Arabia
                            </option>
                        </select>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="salutation">
                            {t("salutation.label")} <span className="color_secondary">*</span>
                        </label>

                        <select
                            id="salutation"
                            className="form-select"
                            name="salutation"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                            >
                                {t(
                                    "salutation.placeholder"
                                )}
                            </option>

                            <option value="Dr">
                                Dr
                            </option>

                            <option value="Mr">
                                Mr
                            </option>

                            <option value="Mrs">
                                Mrs
                            </option>

                            <option value="Ms">
                                Ms
                            </option>
                        </select>
                    </div>
                </div>

            </div>


            {/* First Name / Last Name */}
            <div className="row">

                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="first-name">
                            {t("firstName.label")} <span className="color_secondary">*</span>
                        </label>

                        <input
                            id="first-name"
                            name="firstName"
                            type="text"
                            placeholder={t(
                                "firstName.placeholder"
                            )}
                            autoComplete="given-name"
                        />
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="last-name">
                            {t("lastName.label")} <span className="color_secondary">*</span>
                        </label>

                        <input
                            id="last-name"
                            name="lastName"
                            type="text"
                            placeholder={t(
                                "lastName.placeholder"
                            )}
                            autoComplete="family-name"
                        />
                    </div>
                </div>

            </div>


            {/* Email */}
            <div className="auth_field">
                <label htmlFor="register-email">
                    {t("email.label")} <span className="color_secondary">*</span>
                </label>

                <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder={t(
                        "email.placeholder"
                    )}
                    autoComplete="email"
                />

                <small className="field_hint">
                    {t("email.hint")}
                </small>
            </div>


            {/* Healthcare Professional */}
            <div className="auth_option_group mt-5">

                <h3 className="fsz-18">
                    {t("professional.title")} <span className="color_secondary">*</span>
                </h3>

                <label className="auth_radio">
                    <input
                        type="radio"
                        name="professional"
                        value="healthcare-professional"
                    />

                    <span className="fsz-16">
                        {t(
                            "professional.option"
                        )}
                    </span>
                </label>

            </div>


            {/* Terms */}
            <div className="auth_option_group my-4">

                <h3 className="fsz-18">
                    {t("terms.title")}  <span className="color_secondary">*</span>
                </h3>

                <label className="auth_checkbox">
                    <input
                        type="checkbox"
                        name="terms"
                    />

                    <span className="fsz-16">
                        {t("terms.text")}
                    </span>
                </label>

            </div>


            {/* Marketing Consent */}
            <div className="auth_option_group">

                <h3 className="fsz-18">
                    {t("marketing.title")}
                </h3>

                <label className="auth_checkbox">
                    <input
                        type="checkbox"
                        name="marketing"
                    />

                    <span className="fsz-16">
                        {t("marketing.text")}
                    </span>
                </label>

            </div>


            {/* Privacy Confirmation */}
            <div className="auth_privacy_text mt-4 pt-4 border-top fsz-14 ">
                {t("privacyConfirmation")}
            </div>


            {/* Next */}
            <div className="register_navigation mt-5 ">
                <button
                    type="button"
                    className="butn primary_butn hvr-txt-trans radius-20 th-50 w-fit ms-auto"
                    onClick={onNext}
                >
                    <span
                        className="txt"
                        data-text={t("next")}
                    >
                        <span>
                            {t("next")}
                        </span>
                    </span>

                    <i className="fa-regular fa-arrow-right ms-2" />
                </button>
            </div>


            {/* Login */}
            <div className="register_login fsz-18  mt-4">
                <span>
                    {t("alreadyAccount")}
                </span>

                <Link href="/login">
                    {t("login")}
                </Link>
            </div>

        </div>
    );
};

export default RegisterStepOne;