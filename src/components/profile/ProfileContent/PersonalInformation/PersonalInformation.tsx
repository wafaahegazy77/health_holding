import { getTranslations } from "next-intl/server";

import "./_PersonalInformation.scss";

export async function getPersonalInformationTranslations() {
    const tRegister = await getTranslations("auth.register");
    const tProfile = await getTranslations("profile.personalInformation");

    return {
        personalInformation: tProfile("personalInformation"),

        editDetails: tProfile("editDetails"),
        editPersonalInformation: tProfile("editPersonalInformation"),
        save: tProfile("save"),
        cancel: tProfile("cancel"),

        accountDetails: tProfile("accountDetails"),
        professionalDetails: tProfile("professionalDetails"),

        cantBeChanged: tProfile("cantBeChanged"),
        confirmed: tProfile("confirmed"),
        accepted: tProfile("accepted"),
        readTerms: tProfile("readTerms"),

        preferencesTitle: tProfile("preferences.title"),
        healthcareProfessional: tProfile("preferences.healthcareProfessional"),

        accountSecurityTitle: tProfile("accountSecurity.title"),
        password: tProfile("accountSecurity.password"),
        changePassword: tProfile("accountSecurity.changePassword"),

        salutation: tRegister("salutation.label"),
        firstName: tRegister("firstName.label"),
        lastName: tRegister("lastName.label"),
        email: tRegister("email.label"),
        mobile: tRegister("mobile.label"),

        region: tRegister("ksaRegion.label"),
        healthcareSector: tRegister("healthcareSector.label"),
        workplace: tRegister("workplace.label"),
        postcode: tRegister("postcode.label"),
        scfhs: tRegister("scfhs.label"),

        termsOfUse: tRegister("terms.title"),
        marketingTitle: tRegister("marketing.title"),
        marketingText: tRegister("marketing.text"),
    };
}
