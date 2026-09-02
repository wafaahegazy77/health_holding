import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContentPage from "@/components/ContentPage/ContentPage";

import ContentPagesData from "@/mock-api/content-pages.json";

import { getLocale } from "next-intl/server";

const PrivacyPolicyPage = async () => {
    const locale = await getLocale();
    const currentLocale = locale === "ar" ? "ar" : "en";

    const privacyPolicy =
        ContentPagesData.privacyPolicy;

    return (
        <>
            <Navbar />

            <main>
                <ContentPage
                    title={privacyPolicy.title[currentLocale]}
                    updatedAt={
                        privacyPolicy.updatedAt[
                            currentLocale
                        ]
                    }
                    sections={privacyPolicy.sections.map(
                        (section) => ({
                            title:
                                section.title[
                                    currentLocale
                                ],
                            content:
                                section.content[
                                    currentLocale
                                ],
                        })
                    )}
                />
            </main>

            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;