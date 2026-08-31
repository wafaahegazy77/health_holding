"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";

import "./_RegisterForm.scss";

const RegisterForm = () => {
    const t = useTranslations("auth.register");

    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep((prev) =>
            Math.min(prev + 1, 2)
        );
    };

    const previousStep = () => {
        setCurrentStep((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    return (
        <div className="auth_inner register_inner">

            {/* Progress */}
            <div className="register_progress mb-5">
                <div
                    className={`progress_line ${
                        currentStep >= 1
                            ? "active"
                            : ""
                    }`}
                />

                <div
                    className={`progress_line ${
                        currentStep >= 2
                            ? "active"
                            : ""
                    }`}
                />
            </div>


            {/* Header */}
            <div className="box_header register_header mb-5">

                <div>
                    <h1 className="title">
                        {t("title")}
                    </h1>

                    <p className="description col-lg-10">
                        {t("description")}
                    </p>
                </div>

                <span className="step_label">
                    {t("step", {
                        current: currentStep,
                        total: 2,
                    })}
                </span>

            </div>


            {/* Step 1 */}
            {currentStep === 1 && (
                <RegisterStepOne
                    onNext={nextStep}
                />
            )}


            {/* Step 2 */}
            {currentStep === 2 && (
                <RegisterStepTwo
                    onBack={previousStep}
                    onNext={nextStep}
                />
            )}

        </div>
    );
};

export default RegisterForm;