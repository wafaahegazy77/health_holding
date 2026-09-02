import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContentPage from "@/components/ContentPage/ContentPage";

import ContentPagesData from "@/mock-api/content-pages.json";

import { getLocale } from "next-intl/server";

const TermsConditionsPage = async () => {
    const locale = await getLocale();
    const currentLocale = locale === "ar" ? "ar" : "en";

    const termsConditions =
        ContentPagesData.termsConditions;

    return (
        <>
            <Navbar />

            <main>
                <ContentPage
                    title={
                        termsConditions.title[
                            currentLocale
                        ]
                    }
                    updatedAt={
                        termsConditions.updatedAt[
                            currentLocale
                        ]
                    }
                    sections={termsConditions.sections.map(
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

export default TermsConditionsPage;