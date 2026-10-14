import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContentPage from "@/components/ContentPage/ContentPage";

import { getTermsPage } from "@/lib/api/pages";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

const TermsConditionsPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations("footer");
    const page = await getTermsPage(locale);

    return (
        <>
            <Navbar />

            <main>
                <ContentPage
                    title={page?.title || t("termsConditions")}
                    contentHtml={page?.contentHtml || ""}
                />
            </main>

            <Footer />
        </>
    );
};

export default TermsConditionsPage;
