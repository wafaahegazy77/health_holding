import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/styles/scss/style.scss";
import BootstrapClient from "@/components/BootstrapClient";
import DeferredFontAwesome from "@/components/DeferredFontAwesome";
import Providers from "@/components/Providers";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import MotionProvider from "@/components/MotionProvider";
import { cairo, poppins, prata } from "@/app/fonts";
import { getSiteSettings } from "@/lib/api/home";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const settings = await getSiteSettings(locale);

    return {
        title: "Holding Health",
        description: "Holding Health",
        icons: {
            icon: settings.favicon,
            shortcut: settings.favicon,
            apple: settings.favicon,
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!(routing.locales as readonly string[]).includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const [messages, settings] = await Promise.all([
        getMessages({ locale }),
        getSiteSettings(locale),
    ]);
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html
            lang={locale}
            dir={dir}
            className={`${poppins.variable} ${prata.variable} ${cairo.variable}`}
        >
            <body suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <SiteSettingsProvider value={settings}>
                            <MotionProvider>{children}</MotionProvider>
                        </SiteSettingsProvider>
                    </Providers>
                </NextIntlClientProvider>
                <DeferredFontAwesome />
                <BootstrapClient />
            </body>
        </html>
    );
}
