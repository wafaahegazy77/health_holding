"use client";

import { useTranslations } from "next-intl";

interface RegisterStepTwoProps {
    onBack: () => void;
    onNext: () => void;
}

const RegisterStepTwo = ({
    onBack,
    onNext,
}: RegisterStepTwoProps) => {
    const t = useTranslations("auth.register");

    return (
        <div className="register_step_two">

            {/* Role Statement */}
            <div className="auth_field">
                <label htmlFor="role-statement">
                    {t("roleStatement.label")}  <span className="color_secondary">*</span>
                </label>

                <select
                    id="role-statement"
                    className="form-select"
                    name="roleStatement"
                    defaultValue=""
                >
                    <option
                        value=""
                        disabled
                    >
                        {t(
                            "roleStatement.placeholder"
                        )}
                    </option>

                    <option value="healthcare-professional">
                        Healthcare Professional
                    </option>

                    <option value="industry-partner">
                        Industry Partner
                    </option>
                </select>
            </div>


            {/* KSA Region / Healthcare Sector */}
            <div className="row">

                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="ksa-region">
                            {t("ksaRegion.label")}  <span className="color_secondary">*</span>
                        </label>

                        <select
                            id="ksa-region"
                            className="form-select"
                            name="ksaRegion"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                            >
                                {t(
                                    "ksaRegion.placeholder"
                                )}
                            </option>

                            <option value="riyadh">
                                Riyadh
                            </option>

                            <option value="makkah">
                                Makkah
                            </option>

                            <option value="eastern">
                                Eastern Province
                            </option>
                        </select>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="healthcare-sector">
                            {t("healthcareSector.label")}  <span className="color_secondary">*</span>
                        </label>

                        <select
                            id="healthcare-sector"
                            className="form-select"
                            name="healthcareSector"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                            >
                                {t(
                                    "healthcareSector.placeholder"
                                )}
                            </option>

                            <option value="government">
                                Government
                            </option>

                            <option value="private">
                                Private
                            </option>
                        </select>
                    </div>
                </div>

            </div>


            {/* Role / Workplace */}
            <div className="row">

                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="role">
                            {t("role.label")}  <span className="color_secondary">*</span>
                        </label>

                        <select
                            id="role"
                            className="form-select"
                            name="role"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                            >
                                {t(
                                    "role.placeholder"
                                )}
                            </option>

                            <option value="doctor">
                                Doctor
                            </option>

                            <option value="nurse">
                                Nurse
                            </option>

                            <option value="pharmacist">
                                Pharmacist
                            </option>
                        </select>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="workplace">
                            {t("workplace.label")}  <span className="color_secondary">*</span>
                        </label>

                        <input
                            id="workplace"
                            name="workplace"
                            type="text"
                            placeholder={t(
                                "workplace.placeholder"
                            )}
                        />
                    </div>
                </div>

            </div>


            {/* Post Code */}
            <div className="auth_field">
                <label htmlFor="postcode">
                    {t("postcode.label")}  <span className="color_secondary">*</span>
                </label>

                <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    placeholder={t(
                        "postcode.placeholder"
                    )}
                />
            </div>


            {/* SCFHS / Mobile */}
            <div className="row">

                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="scfhs">
                            {t("scfhs.label")}  <span className="color_secondary">*</span>
                        </label>

                        <input
                            id="scfhs"
                            name="scfhs"
                            type="text"
                            placeholder={t(
                                "scfhs.placeholder"
                            )}
                        />
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="auth_field">
                        <label htmlFor="mobile">
                            {t("mobile.label")} 
                        </label>

                        <input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            placeholder={t(
                                "mobile.placeholder"
                            )}
                        />

                        <small className="field_hint">
                            {t("mobile.hint")}
                        </small>
                    </div>
                </div>

            </div>


            {/* Navigation */}
            <div className="register_navigation mt-4">

                <button
                    type="button"
                    className="butn border hvr-txt-trans radius-20 th-50"
                    onClick={onBack}
                >
                    <i className="fa-regular fa-arrow-left me-2" />
                    <span
                        className="txt"
                        data-text={t("back")}
                    >
                        <span>
                            {t("back")}
                        </span>
                    </span>

                    
                </button>


                <button
                    type="button"
                    className="butn primary_butn hvr-txt-trans radius-20 th-50"
                    onClick={onNext}
                >
                    <span
                        className="txt"
                        data-text={t("Submit")}
                    >
                        <span>
                            {t("Submit")}
                        </span>
                    </span>

                    <i className="fa-regular fa-arrow-right ms-2" />
                </button>

            </div>


            {/* Login */}
            <div className="register_login  fsz-18  mt-4 ">
                <span>
                    {t("alreadyAccount")}
                </span>

                <a href="/login">
                    {t("login")}
                </a>
            </div>

        </div>
    );
};

export default RegisterStepTwo;