import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContentPage from "@/components/ContentPage/ContentPage";

import { getPrivacyPage } from "@/lib/api/pages";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

const PrivacyPolicyPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");
    const page = await getPrivacyPage(locale);

    return (
        <>
            <Navbar />

            <main>
                <ContentPage
                    title={page?.title || t("privacyPolicy")}
                    contentHtml={page?.contentHtml || ""}
                />
            </main>

            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;
