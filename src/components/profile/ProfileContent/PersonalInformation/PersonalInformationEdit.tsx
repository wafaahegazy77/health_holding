"use client";

import { useState } from "react";

import ChangePasswordModal from "../../Modals/ChangePasswordModal";

type ProfileData = {
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

    healthcareProfessional: boolean;
    termsAccepted: boolean;
    marketingCommunications: boolean;
};

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
    const [isEditing, setIsEditing] = useState(false);

    const [isChangePasswordOpen, setIsChangePasswordOpen] =
        useState(false);

    const [formData, setFormData] =
        useState<ProfileData>(data);


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
        setFormData(data);
        setIsEditing(true);
    };


    // -----------------------------------------
    // Cancel
    // -----------------------------------------

    const handleCancel = () => {
        setFormData(data);
        setIsEditing(false);
    };


    // -----------------------------------------
    // Save
    // -----------------------------------------

    const handleSave = () => {
        setIsEditing(false);
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
                            >
                                {translations.cancel}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                className="butn gradient_butn"
                            >
                                {translations.save}
                            </button>

                        </div>
                    )}

                </div>


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
                                        {data.country}
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
                                        {data.salutation}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.firstName}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.firstName}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.lastName}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.lastName}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.email}
                                </div>

                                <div className="profile_info_value">

                                    <span>
                                        {data.email}
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
                                        {data.mobile}
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
                                        {data.roleStatement}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.region}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.region}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.healthcareSector}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.healthcareSector}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.role}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.role}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.workplace}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.workplace}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.postcode}
                                </div>

                                <div className="profile_info_value">
                                    <span>
                                        {data.postcode}
                                    </span>
                                </div>

                            </div>


                            <div className="profile_info_row">

                                <div className="profile_info_label">
                                    {translations.scfhs}
                                </div>

                                <div className="profile_info_value">

                                    <span>
                                        {data.scfhs}
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
                                        data.marketingCommunications
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