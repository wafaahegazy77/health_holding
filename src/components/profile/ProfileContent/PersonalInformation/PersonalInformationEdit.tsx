"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

import type { ProfileData } from "@/lib/api/profile";
import ChangePasswordModal from "../../Modals/ChangePasswordModal";

type PersonalInformationTranslations = {
    personalInformation: string;
    editDetails: string;
    editPersonalInformation: string;
    save: string;
    cancel: string;

    accountDetails: string;
    professionalDetails: string;

    cantBeChanged: string;
    confirmed: string;
    accepted: string;
    readTerms: string;

    preferencesTitle: string;
    healthcareProfessional: string;

    accountSecurityTitle: string;
    password: string;
    changePassword: string;

    country: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;

    roleStatement: string;
    region: string;
    healthcareSector: string;
    role: string;
    workplace: string;
    postcode: string;
    scfhs: string;

    termsOfUse: string;
    marketingTitle: string;
    marketingText: string;
};

type Props = {
    data: ProfileData;
    translations: PersonalInformationTranslations;
};

const PersonalInformationEdit = ({
    data,
    translations,
}: Props) => {
    const locale = useLocale();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isChangePasswordOpen, setIsChangePasswordOpen] =
        useState(false);

    const [profile, setProfile] = useState<ProfileData>(data);
    const [formData, setFormData] = useState<ProfileData>(data);

    useEffect(() => {
        setProfile(data);
        setFormData(data);
    }, [data]);


    // -----------------------------------------
    // Form Change
    // -----------------------------------------

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // -----------------------------------------
    // Edit
    // -----------------------------------------

    const handleEdit = () => {
        setError(null);
        setFormData(profile);
        setIsEditing(true);
    };


    // -----------------------------------------
    // Cancel
    // -----------------------------------------

    const handleCancel = () => {
        if (isSaving) return;
        setError(null);
        setFormData(profile);
        setIsEditing(false);
    };


    // -----------------------------------------
    // Save
    // -----------------------------------------

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lang: locale,
                    salutation: formData.salutation,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    mobile: formData.mobile,
                    healthcareSector: profile.healthcareSector,
                    healthcareSectorOther: profile.healthcareSectorOther,
                    workplaceName: formData.workplace,
                    workplacePostcode: formData.postcode,
                }),
            });

            const result = (await response.json().catch(() => null)) as {
                message?: string;
                errors?: Record<string, string[] | string> | string[] | string;
                data?: ProfileData;
                success?: boolean;
            } | null;

            if (!response.ok) {
                const fieldError =
                    result?.errors && typeof result.errors === "object" && !Array.isArray(result.errors)
                        ? Object.values(result.errors).flatMap((value) =>
                              Array.isArray(value) ? value : [value],
                          )[0]
                        : typeof result?.errors === "string"
                          ? result.errors
                          : Array.isArray(result?.errors)
                            ? result.errors[0]
                            : undefined;

                setError(
                    (typeof fieldError === "string" && fieldError) ||
                        result?.message ||
                        "Unable to update profile.",
                );
                return;
            }

            if (result?.data) {
                setProfile(result.data);
                setFormData(result.data);
            }

            setIsEditing(false);
            router.refresh();
        } catch {
            setError("Unable to update profile.");
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <>
            <div className="personal_information pt-4">

                {/* -----------------------------------------
                    Actions
                ----------------------------------------- */}

                <div className="personal_information_actions d-flex align-items-center justify-content-between mb-4">

                    <h3 className="mb-0">
                        {isEditing
                            ? translations.editPersonalInformation
                            : translations.personalInformation}
                    </h3>


                    {!isEditing && (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="butn white_butn hvr-icon-slide-out-in color_secondary"
                        >
                            <div className="txt">
                                {translations.editDetails}
                            </div>

                            <span className="hvr-icon hvr-icon-current">
                                <i className="fa-regular fa-pen" />
                            </span>

                            <span className="hvr-icon hvr-icon-next">
                                <i className="fa-regular fa-arrow-right" />
                            </span>
                        </button>
                    )}


                    {isEditing && (
                        <div className="edit_actions d-flex align-items-center">

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="butn white_butn me-2"
                                disabled={isSaving}
                            >
                                {translations.cancel}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="butn gradient_butn"
                                disabled={isSaving}
                                aria-busy={isSaving}
                            >
                                {isSaving ? `${translations.save}...` : translations.save}
                            </button>

                        </div>
                    )}

                </div>

                {error ? (
                    <p className="text-danger mb-3" role="alert" style={{ fontSize: 14 }}>
                        {error}
                    </p>
                ) : null}


                {/* -----------------------------------------
                    Account Details
                ----------------------------------------- */}

                <section className="profile_card">

                    <div className="profile_card_header">
                        <h2>
                            {translations.accountDetails}
                        </h2>
                    </div>


                    {!isEditing ? (

                        <div className="profile_card_body">

                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.country}
                                </div>

                                <div className="profile_info_value">

                                    <span>
                                        {profile.country}
                                    </span>

                                    <span className="locked">
                                        <i className="fa-regular fa-lock" />
                                        {translations.cantBeChanged}
                                    </span>

                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.salutation}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.salutation}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.firstName}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.firstName}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.lastName}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.lastName}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.email}
                                </div>

                                <div className="profile_info_value">

                                    <span>
                                        {profile.email}
                                    </span>

                                    <span className="locked">
                                        <i className="fa-regular fa-lock" />
                                        {translations.cantBeChanged}
                                    </span>

                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.mobile}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.mobile}
                                    </span>
                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="profile_edit_grid">

                            <div className="row">

                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.firstName}
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        />

                                    </div>

                                </div>


                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.lastName}
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        />

                                    </div>

                                </div>


                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.salutation}
                                        </label>

                                        <select
                                            name="salutation"
                                            className="form-select"
                                            value={formData.salutation}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        >
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


                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.mobile}
                                        </label>

                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* -----------------------------------------
                    Professional Details
                ----------------------------------------- */}

                <section className="profile_card">

                    <div className="profile_card_header">
                        <h2>
                            {translations.professionalDetails}
                        </h2>
                    </div>


                    {!isEditing ? (

                        <div className="profile_card_body">

                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.roleStatement}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.roleStatement}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.region}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.region}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.healthcareSector}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.healthcareSector}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.role}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.role}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.workplace}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.workplace}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.postcode}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {profile.postcode}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.scfhs}
                                </div>

                                <div className="profile_info_value">

                                    <span>
                                        {profile.scfhs}
                                    </span>

                                    <span className="locked">
                                        <i className="fa-regular fa-lock" />
                                        {translations.cantBeChanged}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="profile_edit_grid">

                            <div className="row">

                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.region}
                                        </label>

                                        <select
                                            name="region"
                                            className="form-select"
                                            value={formData.region}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        >
                                            <option value="Al-Riyadh">
                                                Al-Riyadh
                                            </option>

                                            <option value="Makkah">
                                                Makkah
                                            </option>

                                            <option value="Madinah">
                                                Madinah
                                            </option>

                                            <option value="Eastern Province">
                                                Eastern Province
                                            </option>

                                        </select>

                                    </div>

                                </div>


                                <div className="col-lg-6">

                                    <div className="form_group">

                                        <label>
                                            {translations.postcode}
                                        </label>

                                        <input
                                            type="text"
                                            name="postcode"
                                            value={formData.postcode}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        />

                                    </div>

                                </div>


                                <div className="col-lg-12">

                                    <div className="form_group">

                                        <label>
                                            {translations.workplace}
                                        </label>

                                        <input
                                            type="text"
                                            name="workplace"
                                            value={formData.workplace}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* -----------------------------------------
                    Preferences & Consents
                ----------------------------------------- */}

                <section className="profile_card">

                    <div className="profile_card_header">
                        <h2>
                            {translations.preferencesTitle}
                        </h2>
                    </div>


                    <div className="profile_card_body">

                        <div className="profile_info_row">

                            <div className="profile_info_label">
                                {translations.healthcareProfessional}
                            </div>

                            <div className="profile_info_value">

                                <span className="status_badge">
                                    <i className="fa-regular fa-check" />
                                    {translations.confirmed}
                                </span>

                                <span className="locked">
                                    <i className="fa-regular fa-lock" />
                                    {translations.cantBeChanged}
                                </span>

                            </div>

                        </div>


                        <div className="profile_info_row">

                            <div className="profile_info_label">
                                {translations.termsOfUse}
                            </div>

                            <div className="profile_info_value">

                                <span className="status_badge">
                                    <i className="fa-regular fa-check" />
                                    {translations.accepted}
                                </span>

                                <button
                                    type="button"
                                    className="read_terms_btn"
                                >
                                    {translations.readTerms}
                                </button>

                            </div>

                        </div>


                        <div className="marketing_row">

                            <div className="marketing_content">

                                <h3>
                                    {translations.marketingTitle}
                                </h3>

                                <p>
                                    {translations.marketingText}
                                </p>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    defaultChecked={
                                        profile.marketingCommunications
                                    }
                                />

                                <span className="slider" />

                            </label>

                        </div>

                    </div>

                </section>


                {/* -----------------------------------------
                    Account Security
                ----------------------------------------- */}

                <section className="profile_card">

                    <div className="profile_card_header">
                        <h2>
                            {translations.accountSecurityTitle}
                        </h2>
                    </div>


                    <div className="security_row">

                        <div className="security_info">

                            <div className="security_icon">
                                <i className="fa-regular fa-lock" />
                            </div>

                            <div>

                                <h3>
                                    {translations.password}
                                </h3>

                                <span>
                                    •••••••••
                                </span>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="change_password_btn"
                            onClick={() =>
                                setIsChangePasswordOpen(true)
                            }
                        >
                            {translations.changePassword}
                        </button>

                    </div>

                </section>

            </div>


            {/* -----------------------------------------
                Change Password Modal
            ----------------------------------------- */}

            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() =>
                    setIsChangePasswordOpen(false)
                }
            />

        </>
    );
};

export default PersonalInformationEdit;
